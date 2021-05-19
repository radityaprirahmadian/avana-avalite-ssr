import React from 'react';
import PolicyContent from './PolicyContent';
import Modal from 'src/components/Modal';
import { ArrowBack } from '@material-ui/icons';
import writeLocalization from 'src/helpers/localization'
import mobileTabletCheck from 'src/helpers/mobileTabletCheck';

function PrivacyPolicy(props) {
  const [Display, setDisplay] = React.useState(false);
  const RefList = React.useRef(null);

  const toggle = React.useCallback(() => {
    setDisplay(!Display);
    if (!Display) {
      props?.onOpen && props.onOpen();
    }
  }, [Display, props]);
  const lang = {}
  return (
    <section>
      <Modal
        in={Display}
        toggleModal={toggle}
        content={() => (
          <div
            className="fixed inset-0 bg-white mx-auto"
            style={{
              ...(!mobileTabletCheck() ? {
                minWidth: '300px',
                maxWidth: '375px',
              } : {
                width: '100%'
              })
            }}
          >
              <div
                className="flex flex-col h-screen pb-4"
              >
                <section
                  className="sticky my-4 flex items-center text-lg px-4"
                >
                  <ArrowBack
                    className="mr-2"
                    onClick={() => toggle()}
                    style={{
                      marginRight: '1rem',
                      cursor: 'pointer'
                    }}
                  />
                  <h3 className="is-size-4 my-2 has-text-first">
                    <span> {lang?.text__title_PRIVACY_POLICY || 'PRIVACY POLICY'}</span>
                  </h3>
                </section>
                <section
                  id="inputlist"
                  className="h-full overflow-y-auto px-4"
                  ref={RefList}
                >
                  <PolicyContent shopInfo={props?.shopInfo} />
                </section>
              </div>
          </div>
        )}
    >
      {() => (
        <div style={{textAlign: 'center', padding: props.footer ? '0.5rem 0.25rem 0' : '0 0.25rem 0.5rem', fontSize: '12px'}}>
          {writeLocalization(
            lang?.text__confirm_agree_privacy_policy || 'By providing my personal data herein, I confirm that I have read and agree to [0]',
            [props?.shopInfo?.shop_name]
          )}{" "}
          {<u style={{cursor: 'pointer'}} onClick={() => toggle()}>{lang?.btn__privacy_policy || 'privacy policy'}</u>}
        </div>
      )}
      </Modal>
    </section>
  );
}

export default PrivacyPolicy;