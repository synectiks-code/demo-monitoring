package notifiers

import (
	"net"
	"strconv"
	"strings"
	"time"

	"fmt"

	"github.com/grafana/grafana/pkg/bus"
	"github.com/grafana/grafana/pkg/components/simplejson"
	//"github.com/grafana/grafana/pkg/infra/log"
	"github.com/grafana/grafana/pkg/models"
	"github.com/grafana/grafana/pkg/services/alerting"
	//"flag"
	"gopkg.in/Graylog2/go-gelf.v2/gelf"
	"io"
	"log"
	"os"
)

func init() {
	alerting.RegisterNotifier(&alerting.NotifierPlugin{
		Type:        "GELF TCP",
		Name:        "GELF TCP",
		Description: "Sends notifications to GELF TCP Input",
		Heading:     "GELF TCP Input settings",
		Factory:     NewGelfTcpNotifier,
		OptionsTemplate: `
      <h3 class="page-heading">GELF TCP Input settings</h3>
      <div class="gf-form">
        <span class="gf-form-label width-14">IP Address</span>
        <input type="text" required class="gf-form-input max-width-22" ng-model="ctrl.model.settings.gelfTcpInputIpAddress" placeholder="0.0.0.0 or 127.0.0.1"></input>
      </div>
      <div class="gf-form">
        <span class="gf-form-label width-14">Port No</span>
        <input type="text" required class="gf-form-input max-width-22" ng-model="ctrl.model.settings.gelfTcpInputPort" placeholder="12201"></input>
      </div>
    `,
		Options: []alerting.NotifierOption{
			{
				Label:        "IP Address",
				Element:      alerting.ElementTypeInput,
				InputType:    alerting.InputTypeText,
				Placeholder:  "127.0.0.1",
				PropertyName: "gelfTcpInputIpAddress",
				Required:     true,
			},
			{
				Label:        "Port No",
				Element:      alerting.ElementTypeInput,
				InputType:    alerting.InputTypeText,
				Placeholder:  "12201",
				PropertyName: "gelfTcpInputPort",
				Required:     true,
			},
		},
	})
}

// NewGelfTcpNotifier is the constructor function for the GELF TCP notifier.
func NewGelfTcpNotifier(model *models.AlertNotification) (alerting.Notifier, error) {
	ipAddress := model.Settings.Get("gelfTcpInputIpAddress").MustString()
	if ipAddress == "" {
		return nil, alerting.ValidationError{Reason: "Could not find GELF TCP input IP address property in settings"}
	}
	port := model.Settings.Get("gelfTcpInputPort").MustString()
	if port == "" {
		return nil, alerting.ValidationError{Reason: "Could not find GELF TCP input port property in settings"}
	}

	return &GelfTcpNotifier{
		NotifierBase:          NewNotifierBase(model),
		GelfTcpInputIpAddress: ipAddress,
		GelfTcpInputPort:      port,
		//log:          log.Logger{},
	}, nil
}

// GelfTcpNotifier is responsible for sending
// alert notifications to Kafka.
type GelfTcpNotifier struct {
	NotifierBase
	GelfTcpInputIpAddress string
	GelfTcpInputPort      string
	//log      log.Logger
}

// Notify sends the alert notification to GELF TCP.
func (gtn *GelfTcpNotifier) Notify(evalContext *alerting.EvalContext) error {
	//state := evalContext.Rule.State

	customData := triggMetrString
	for _, evt := range evalContext.EvalMatches {
		customData += fmt.Sprintf("%s: %v\n", evt.Metric, evt.Value)
	}

	recordJSON := simplejson.New()
	records := make([]interface{}, 1)
	bodyJSON := simplejson.New()
	bodyJSON.Set("name", evalContext.Rule.Name)
	bodyJSON.Set("alert_state", "New")
	bodyJSON.Set("description", evalContext.Rule.Name+" - "+evalContext.Rule.Message)
	bodyJSON.Set("client", "Grafana")
	bodyJSON.Set("details", customData)
	bodyJSON.Set("incident_key", "alertId-"+strconv.FormatInt(evalContext.Rule.ID, 10))
	tags := evalContext.Rule.AlertRuleTags
	if tags != nil {
		for _, tag := range tags {
			bodyJSON.Set(tag.Key, tag.Value)
		}
	}
	a, _ := evalContext.GetDashboardUID()
	alertGuid := a.Uid + fmt.Sprint(unixMilli(time.Now()))
	bodyJSON.Set("guid", alertGuid)
	ruleURL, err := evalContext.GetRuleURL()
	if err != nil {
		//gtn.log.Error("Failed get rule link", "error", err)
		return err
	}
	ipAddress := GetLocalIP()
	ruleURL = strings.Replace(ruleURL, "localhost", ipAddress, -1)
	//fmt.Println("client URL: ", ruleURL)
	bodyJSON.Set("client_url", ruleURL+"&removeOptions=1")
	timeNow := time.Now()
	bodyJSON.Set("created_on", unixMilli(timeNow))
	bodyJSON.Set("updated_on", unixMilli(timeNow))
	bodyJSON.Set("firedtime", fmt.Sprint(timeNow))
	//
	if gtn.NeedsImage() && evalContext.ImagePublicURL != "" {
		contexts := make([]interface{}, 1)
		imageJSON := simplejson.New()
		imageJSON.Set("type", "image")
		imageJSON.Set("src", evalContext.ImagePublicURL)
		contexts[0] = imageJSON
		bodyJSON.Set("contexts", contexts)
	}
	//
	valueJSON := simplejson.New()
	valueJSON.Set("value", bodyJSON)
	records[0] = valueJSON
	recordJSON.Set("records", records)
	body, _ := recordJSON.MarshalJSON()

	gelfTcpURL := gtn.GelfTcpInputIpAddress + ":" + gtn.GelfTcpInputPort
	gelfWriter, err := gelf.NewTCPWriter(gelfTcpURL)
	if err != nil {
		log.Fatalf("gelf.NewWriter: %s", err)
	}
	log.SetOutput(io.MultiWriter(os.Stderr, gelfWriter))
	log.Printf(string(body))
	return nil
}

func GetIP() string {
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

func unixTimeInMilli(t time.Time) int64 {
	return t.Round(time.Millisecond).UnixNano() / (int64(time.Millisecond) / int64(time.Nanosecond))
}

func sendAlertActivityToGelfTcp(alertGuid string, timeNow time.Time, kn *KafkaNotifier, evalContext *alerting.EvalContext) error {
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
