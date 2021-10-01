import React from 'react';
import PolicyContent from './PolicyContent';
import Modal from 'src/components/Modal';
import { Checkbox } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import mobileTabletCheck from 'src/helpers/mobileTabletCheck';
import writeLocalization from 'src/helpers/localization'
import { getCurrentLang } from 'src/helpers/localization'
import Localization from 'src/configs/lang/privacy-policy';

function PrivacyPolicy(props) {
  const [Display, setDisplay] = React.useState(false);
  const [isCheck, setIsCheck] = React.useState(props.checkboxValue || false);
  const RefList = React.useRef(null);
  const lang = Localization[getCurrentLang()]

  const toggle = React.useCallback(() => {
    setDisplay(!Display);
    if (!Display) {
      props?.onOpen && props.onOpen();
    }
  }, [Display, props]);

  const changeCheckbox = React.useCallback(() => {
    if (props.isCheckbox) {
      setIsCheck(!isCheck);
    }
    if (props.isCheckbox && props.onCheck) {
      props.onCheck(!isCheck);
    }
  }, [isCheck, props]);

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
                <PolicyContent lang={lang} shopInfo={props?.shopInfo} />
              </section>
            </div>
          </div>
        )}
      >
      {() => (
        <div className="flex my-2">
          {
            props.isCheckbox && (
              <div>
                <Checkbox
                  color="primary"
                  checked={isCheck}
                  onChange={changeCheckbox}
                />
              </div>
            )
          }
          <div className={`text-xs px-1 pt-2 ${props.isCheckbox ? 'text-left' : 'text-center'}`}>
            {writeLocalization(
              lang?.text__confirm_agree_privacy_policy || 'By providing my personal data herein, I confirm that I have read and agree to [0] [1]',
              [props?.shopInfo?.shop_name, <u key="policy-modal-toggler" style={{cursor: 'pointer'}} onClick={() => toggle()}>{lang?.btn__privacy_policy || 'privacy policy'}</u>]
            )}
          </div>
        </div>
        
      )}
      </Modal>
    </section>
  );
}

export default PrivacyPolicy;