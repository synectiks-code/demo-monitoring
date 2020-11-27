import React, { FC, ReactElement } from 'react';
import { selectors } from '@grafana/e2e-selectors';

import { FormModel } from './LoginCtrl';
import { Button, Form, Input, Field } from '@grafana/ui';
import { css } from 'emotion';

interface Props {
  children: ReactElement;
  onSubmit: (data: FormModel) => void;
  isLoggingIn: boolean;
  passwordHint: string;
  loginHint: string;
}

const wrapperStyles = css`
  width: 100%;
  padding-bottom: 16px;
`;
const loginForm = css`
  display: none;
`;
export const submitButton = css`
  justify-content: center;
  width: 100%;
`;
// let validated = false;
var userName: any;
// let showMfa = true;
const validateMfa = async () => {
  let documentUserName: any = document.getElementById('userName');
  userName = documentUserName.value;
  console.log('username=', userName);
  let documentMfaCode: any = document.getElementById('mfaCode');
  let mfaCode = documentMfaCode.value;
  const data = new FormData();
  data.append('userName', userName);
  data.append('secretKey', '2N4VAPDCX3COKCSVFXGAKKHSFFHP23KB');
  data.append('mfaCode', mfaCode);
  let res: any;
  await fetch('http://localhost:7011/authenticateMfaToken', {
    method: 'POST',
    body: data,
  })
    .then(response => response.json())
    .then(response => {
      res = response;
    });
  console.log('res: ', res);
  if (res === 200) {
    let documentLoginForm: any = document.getElementById('loginForm');
    documentLoginForm.style.display = 'block';
    let documentMfaForm: any = document.getElementById('mfaForm');
    documentMfaForm.style.display = 'none';
    let user: any = document.getElementById('user');
    user.value = userName;
  } else {
    let documentErrorMsg: any = document.getElementById('errorMsg');
    documentErrorMsg.innerText = 'Invalid MFA Code';
  }
};
export const LoginForm: FC<Props> = ({ children, onSubmit, isLoggingIn, passwordHint, loginHint }) => {
  return (
    <div className={wrapperStyles}>
      <div id="loginForm" className={loginForm} style={{ display: `none` }}>
        <Form onSubmit={onSubmit} validateOn="onChange">
          {({ register, errors }) => (
            <>
              <Field label="E-mail Address" invalid={!!errors.user} error={errors.user?.message}>
                <Input
                  autoFocus
                  name="user"
                  ref={register({ required: 'Email is required' })}
                  placeholder={loginHint}
                  value={userName}
                  aria-label={selectors.pages.Login.username}
                  id="user"
                />
              </Field>
              <Field label="Password" invalid={!!errors.password} error={errors.password?.message}>
                <Input
                  name="password"
                  type="password"
                  placeholder={passwordHint}
                  ref={register({ required: 'Password is required' })}
                  aria-label={selectors.pages.Login.password}
                />
              </Field>
              <Button aria-label={selectors.pages.Login.submit} className={submitButton} disabled={isLoggingIn}>
                {isLoggingIn ? 'Logging in...' : 'Login'}
              </Button>
              {children}
            </>
          )}
        </Form>
      </div>
      <form name="mfaForm" id="mfaForm">
        <div className="css-1w4npsm">
          <h4 id="errorMsg" style={{ color: `red` }}></h4>
        </div>
        <input type="text" className="css-1bjepp-input-input" name="userName" id="userName" placeholder="Username" />
        <input type="text" className="css-1bjepp-input-input" name="mfaCode" id="mfaCode" placeholder="Mfa Code" />
        <input
          type="button"
          onClick={validateMfa}
          className="css-6ntnx5-button"
          style={{ background: `#003087`, color: `#fff` }}
          value="Validate"
        />
      </form>
    </div>
  );
};
