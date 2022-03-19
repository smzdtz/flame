import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

// UI
import { Button, SettingsHeadline } from '../../UI';
import { AuthForm } from './AuthForm/AuthForm';
import classes from './AppDetails.module.css';

// Store
import { useSelector } from 'react-redux';
import { State } from '../../../store/reducers';

// Other
import { checkVersion } from '../../../utility';

export const AppDetails = (): JSX.Element => {
  const { t } = useTranslation();
  const { isAuthenticated } = useSelector((state: State) => state.auth);

  return (
    <Fragment>
      <SettingsHeadline text={t('Authentication')} />
      <AuthForm />

      {isAuthenticated && (
        <Fragment>
          <hr className={classes.separator} />

          <div>
            <SettingsHeadline text={t('App version')} />
            <p className={classes.text}>
              <a
                href="https://github.com/pawelmalak/flame"
                target="_blank"
                rel="noreferrer"
              >
                Flame
              </a>{' '}
              {`${t('version')} ${process.env.REACT_APP_VERSION}`}
            </p>

            <p className={classes.text}>
              {`${t('See changelog')} `}
              <a
                href="https://github.com/pawelmalak/flame/blob/master/CHANGELOG.md"
                target="_blank"
                rel="noreferrer"
              >
                {t('here')}
              </a>
            </p>

            <Button click={() => checkVersion(true)}>
              {t('Check for updates')}
            </Button>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};
