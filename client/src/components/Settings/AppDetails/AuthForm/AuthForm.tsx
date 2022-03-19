import { FormEvent, Fragment, useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../../../../store';
import { State } from '../../../../store/reducers';
import { decodeToken, parseTokenExpire } from '../../../../utility';

// Other
import { InputGroup, Button } from '../../../UI';
import classes from '../AppDetails.module.css';

export const AuthForm = (): JSX.Element => {
  const { isAuthenticated, token } = useSelector((state: State) => state.auth);
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const { login, logout } = bindActionCreators(actionCreators, dispatch);

  const [tokenExpires, setTokenExpires] = useState('');
  const [formData, setFormData] = useState({
    password: '',
    duration: '14d',
  });

  const passwordInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    passwordInputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (token) {
      const decoded = decodeToken(token);
      const expiresIn = parseTokenExpire(decoded.exp);
      setTokenExpires(expiresIn);
    }
  }, [token]);

  const formHandler = (e: FormEvent) => {
    e.preventDefault();
    login(formData);
    setFormData({
      password: '',
      duration: '14d',
    });
  };

  return (
    <Fragment>
      {!isAuthenticated ? (
        <form onSubmit={formHandler}>
          <InputGroup>
            <label htmlFor="password">{t('Password')}</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••"
              autoComplete="current-password"
              ref={passwordInputRef}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <span>
              {t('See')}
              <a
                href="https://github.com/pawelmalak/flame/wiki/Authentication"
                target="blank"
              >
                {` ${t('project wiki')} `}
              </a>
              {t('to read more about authentication')}
            </span>
          </InputGroup>

          <InputGroup>
            <label htmlFor="duration">{t('Session duration')}</label>
            <select
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={(e) =>
                setFormData({ ...formData, duration: e.target.value })
              }
            >
              <option value="1h">1 {t('hour')}</option>
              <option value="1d">1 {t('day')}</option>
              <option value="14d">2 {t('weeks')}</option>
              <option value="30d">1 {t('month')}</option>
              <option value="1y">1 {t('year')}</option>
            </select>
          </InputGroup>

          <Button>{t('Login')}</Button>
        </form>
      ) : (
        <div>
          <p className={classes.text}>
            {`${t('You are logged in. Your session will expire')} `}
            <span>{tokenExpires}</span>
          </p>
          <Button click={logout}>{t('Logout')}</Button>
        </div>
      )}
    </Fragment>
  );
};
