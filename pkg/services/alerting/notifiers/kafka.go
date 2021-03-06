package notifiers

import (
	"net"
	"strconv"
	"strings"
	"time"

	"fmt"

	"github.com/grafana/grafana/pkg/bus"
	"github.com/grafana/grafana/pkg/components/simplejson"
	"github.com/grafana/grafana/pkg/infra/log"
	"github.com/grafana/grafana/pkg/models"
	"github.com/grafana/grafana/pkg/services/alerting"
)

func init() {
	alerting.RegisterNotifier(&alerting.NotifierPlugin{
		Type:        "kafka",
		Name:        "Kafka REST Proxy",
		Description: "Sends notifications to Kafka Rest Proxy",
		Heading:     "Kafka settings",
		Factory:     NewKafkaNotifier,
		OptionsTemplate: `
      <h3 class="page-heading">Kafka settings</h3>
      <div class="gf-form">
        <span class="gf-form-label width-14">Kafka REST Proxy</span>
        <input type="text" required class="gf-form-input max-width-22" ng-model="ctrl.model.settings.kafkaRestProxy" placeholder="http://localhost:8082"></input>
      </div>
      <div class="gf-form">
        <span class="gf-form-label width-14">Topic</span>
        <input type="text" required class="gf-form-input max-width-22" ng-model="ctrl.model.settings.kafkaTopic" placeholder="topic1"></input>
      </div>
    `,
		Options: []alerting.NotifierOption{
			{
				Label:        "Kafka REST Proxy",
				Element:      alerting.ElementTypeInput,
				InputType:    alerting.InputTypeText,
				Placeholder:  "http://localhost:8082",
				PropertyName: "kafkaRestProxy",
				Required:     true,
			},
			{
				Label:        "Topic",
				Element:      alerting.ElementTypeInput,
				InputType:    alerting.InputTypeText,
				Placeholder:  "topic1",
				PropertyName: "kafkaTopic",
				Required:     true,
			},
		},
	})
}

// NewKafkaNotifier is the constructor function for the Kafka notifier.
func NewKafkaNotifier(model *models.AlertNotification) (alerting.Notifier, error) {
	endpoint := model.Settings.Get("kafkaRestProxy").MustString()
	if endpoint == "" {
		return nil, alerting.ValidationError{Reason: "Could not find kafka rest proxy endpoint property in settings"}
	}
	topic := model.Settings.Get("kafkaTopic").MustString()
	if topic == "" {
		return nil, alerting.ValidationError{Reason: "Could not find kafka topic property in settings"}
	}

	return &KafkaNotifier{
		NotifierBase: NewNotifierBase(model),
		Endpoint:     endpoint,
		Topic:        topic,
		log:          log.New("alerting.notifier.kafka"),
	}, nil
}

// KafkaNotifier is responsible for sending
// alert notifications to Kafka.
type KafkaNotifier struct {
	NotifierBase
	Endpoint string
	Topic    string
	log      log.Logger
}

// Notify sends the alert notification.
func (kn *KafkaNotifier) Notify(evalContext *alerting.EvalContext) error {
	state := evalContext.Rule.State

	customData := triggMetrString
	for _, evt := range evalContext.EvalMatches {
		customData += fmt.Sprintf("%s: %v\n", evt.Metric, evt.Value)
	}

	kn.log.Info("Notifying Kafka", "alert_state", state)

	recordJSON := simplejson.New()
	records := make([]interface{}, 1)

	bodyJSON := simplejson.New()
	//get alert state in the kafka output issue #11401
	//bodyJSON.Set("alert_state", state)
	bodyJSON.Set("name", evalContext.Rule.Name)
	bodyJSON.Set("alert_state", "New")
	bodyJSON.Set("description", evalContext.Rule.Name+" - "+evalContext.Rule.Message)
	bodyJSON.Set("client", "Grafana")
	bodyJSON.Set("details", customData)
	bodyJSON.Set("incident_key", "alertId-"+strconv.FormatInt(evalContext.Rule.ID, 10))
	tags := evalContext.Rule.AlertRuleTags
	if tags != nil {
		for _, tag := range tags {
			//kn.log.Info("tag : ", tag)
			bodyJSON.Set(tag.Key, tag.Value)
		}
	}
	a, _ := evalContext.GetDashboardUID()
	alertGuid := a.Uid + fmt.Sprint(unixMilli(time.Now()))
	bodyJSON.Set("guid", alertGuid)
	ruleURL, err := evalContext.GetRuleURL()
	if err != nil {
		kn.log.Error("Failed get rule link", "error", err)
		return err
	}
	ipAddress := GetLocalIP()
	//kn.log.Info("Server ip : ",ipAddress)
	ruleURL = strings.Replace(ruleURL, "localhost", ipAddress, -1)
	fmt.Println("client URL: ", ruleURL)
	bodyJSON.Set("client_url", ruleURL+"&removeOptions=1")
	timeNow := time.Now()
	bodyJSON.Set("created_on", unixMilli(timeNow))
	bodyJSON.Set("updated_on", unixMilli(timeNow))
	bodyJSON.Set("firedtime", fmt.Sprint(timeNow))

	if kn.NeedsImage() && evalContext.ImagePublicURL != "" {
		contexts := make([]interface{}, 1)
		imageJSON := simplejson.New()
		imageJSON.Set("type", "image")
		imageJSON.Set("src", evalContext.ImagePublicURL)
		contexts[0] = imageJSON
		bodyJSON.Set("contexts", contexts)
	}

	valueJSON := simplejson.New()
	valueJSON.Set("value", bodyJSON)
	records[0] = valueJSON
	recordJSON.Set("records", records)
	body, _ := recordJSON.MarshalJSON()

	topicURL := kn.Endpoint + "/topics/" + kn.Topic

	cmd := &models.SendWebhookSync{
		Url:        topicURL,
		Body:       string(body),
		HttpMethod: "POST",
		HttpHeader: map[string]string{
			"Content-Type": "application/vnd.kafka.json.v2+json",
			"Accept":       "application/vnd.kafka.v2+json",
		},
	}

	if err := bus.DispatchCtx(evalContext.Ctx, cmd); err != nil {
		kn.log.Error("Failed to send notification to Kafka", "error", err, "body", string(body))
		return err
	}
	sendAlertActivityToKafka(alertGuid, timeNow, kn, evalContext)
	return nil
}

func GetLocalIP() string {
	addrs, err := net.InterfaceAddrs()
	if err != nil {
		return ""
	}
	for _, address := range addrs {
		// check the address type and if it is not a loopback the display it
		if ipnet, ok := address.(*net.IPNet); ok && !ipnet.IP.IsLoopback() {
			if ipnet.IP.To4() != nil {
				return ipnet.IP.String()
			}
		}
	}
	return ""
}

func unixMilli(t time.Time) int64 {
	return t.Round(time.Millisecond).UnixNano() / (int64(time.Millisecond) / int64(time.Nanosecond))
}

func sendAlertActivityToKafka(alertGuid string, timeNow time.Time, kn *KafkaNotifier, evalContext *alerting.EvalContext) error {
	recordJSON := simplejson.New()
	records := make([]interface{}, 1)
	bodyJSON := simplejson.New()

	bodyJSON.Set("guid", alertGuid)
	bodyJSON.Set("name", evalContext.Rule.Name)
	bodyJSON.Set("action", "New alert")
	bodyJSON.Set("action_description", "New alert fired from grafana")
	bodyJSON.Set("created_on", unixMilli(timeNow))
	bodyJSON.Set("updated_on", unixMilli(timeNow))
	bodyJSON.Set("alert_state", "New")
	bodyJSON.Set("ticket_id", 0)
	bodyJSON.Set("ticket_name", "")
	bodyJSON.Set("ticket_url", "")
	bodyJSON.Set("ticket_description", "")
	bodyJSON.Set("user_name", "Automated")
	bodyJSON.Set("event_type", "Insert")
	bodyJSON.Set("change_log", "")
	bodyJSON.Set("fired_time", fmt.Sprint(timeNow))

	valueJSON := simplejson.New()
	valueJSON.Set("value", bodyJSON)
	records[0] = valueJSON
	recordJSON.Set("records", records)
	body, _ := recordJSON.MarshalJSON()

	topicURL := kn.Endpoint + "/topics/alert_activity"

	cmd := &models.SendWebhookSync{
		Url:        topicURL,
		Body:       string(body),
		HttpMethod: "POST",
		HttpHeader: map[string]string{
			"Content-Type": "application/vnd.kafka.json.v2+json",
			"Accept":       "application/vnd.kafka.v2+json",
		},
	}

	if err := bus.DispatchCtx(evalContext.Ctx, cmd); err != nil {
		kn.log.Error("Failed to send alert activity notification to Kafka", "error", err, "body", string(body))
		return err
	}

	return nil

}
