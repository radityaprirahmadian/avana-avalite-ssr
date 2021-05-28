import React from 'react';

import { InputAdornment } from '@material-ui/core';
import Modal from '../Modal';
import { ArrowBack, Search, CheckCircle, ChevronRight } from '@material-ui/icons';
import TextField from './TextField';
import Spinner from '../Spinner';
import ErrorWrapper from '../ErrorsWrapper';
import mobileTabletCheck from 'src/helpers/mobileTabletCheck';

export default function InputList(props) {
  const [Selected, setSelected] = React.useState(null);
  const [SearchValue, setSearchValue] = React.useState('');
  const [Display, setDisplay] = React.useState(false);
  const [Position, setPosition] = React.useState(null);
  const [Options, setOptions] = React.useState(props?.options || []);
  const [Page, setPage] = React.useState({
    current: 1,
    last: 1,
    loading: false
  });
  const [ErrorMessage, setErrorMessage] = React.useState(null);
  const RefList = React.useRef(null);

  const handleScrollSelected = React.useCallback(() => {
    document.getElementById(Position) && document.getElementById(Position).scrollIntoView({
      block: 'start',
    });
  }, [Position]);

  const handleFilter = React.useCallback((value, page = 1) => {
    let options = props?.options || [];
    if (value) {
      options = options
        .filter((el) =>{
          try {
            return props.optionLabel(el).match(new RegExp(value, 'ig'));
          } catch {
            return false;
          }
        })
    }

    setOptions(options.slice(0, ((props?.limit || props.options.length) * page)));

    setPage((prevState) => ({
      ...prevState,
      last: Math.ceil(options.length / (props?.limit || 1)),
      loading: false
    }))
  }, [props]);

  const handleScrollItems = React.useCallback(() => {
    if ((document.getElementById('inputlist').scrollHeight -
      document.getElementById('inputlist').scrollTop <
      document.getElementById('inputlist').clientHeight + 100) &&
      (Page.current < Page.last) && (!Page.loading))
    {
      setPage((prevState) => {
        handleFilter(SearchValue, prevState.current + 1);
          return ({
            ...prevState,
            current: prevState.current + 1,
            loading: true
          })
      });
    }
  }, [SearchValue, Page, handleFilter]);

  const toggle = React.useCallback(() => {
    setDisplay(!Display);
    if (!Display) {
      props?.onOpen && props.onOpen();
      Position && handleScrollSelected();
      handleFilter(SearchValue);
      setPage((prevState) => ({
        ...prevState,
        current: 1,
        last: Math.ceil(props?.options?.length / props?.limit),
        loading: false
      }));
    } else {
      setSearchValue('');
    }
  }, [Display, SearchValue, props, Position, handleScrollSelected, handleFilter]);

  const onClick = React.useCallback((value, idList) => {
    const valueSelected = props?.valueKey ? props?.valueKey(value) : value;
    setSelected(value);
    setPosition(idList);
    props?.onChange && props.onChange(valueSelected);
    toggle();
  }, [props, toggle]);

  const onChangeSearch = React.useCallback((event) => {
    const { value } = event?.target;
    setSearchValue(value);
    if (value && props?.onSearch) {
      props.onSearch(event);
    }
    setPage((prevState) => ({
      ...prevState,
      current: 1
    }));
    handleFilter(value);
  }, [props, handleFilter]);

  const isSelected = React.useCallback((compareValue) => {
    return props?.valueKey
      ? String(props?.valueKey(Selected)) === String(props?.valueKey(compareValue))
      : String(Selected) === String(compareValue);
  }, [Selected, props]);

  React.useEffect(() => {
    if (Display) {
      Position && handleScrollSelected();
    }
  }, [Display, Position, handleScrollSelected]);


  React.useEffect(() => {
    if (SearchValue && !props?.loading && Options.length <= 0) {
      setErrorMessage({
        title: 'Opps!',
        message: props?.errorSearch || `The ${props?.label || 'data'} you are looking for was not found`
      })
    } else {
      setErrorMessage(null);
    }
  }, [SearchValue, props, Options]);


  React.useEffect(() => {
    let options = props?.options || [];
    if (props?.limit) {
      options = options.slice(0, props?.limit);
      setPage((prevState) => ({
        ...prevState,
        last: Math.ceil(props?.options?.length / props?.limit),
      }))
    }
    setOptions(options);
    if (props?.value) {
      const value = props?.valueKey
        ? props.options[Object.keys(props?.options).filter((key) => String(props?.valueKey(props?.options?.[key])) === String(props?.value))[0]]
        : props?.value;
      setSelected(value);
    }
    // eslint-disable-next-line
  }, [props?.value, props?.options]);

  React.useEffect(() => {
    if (props?.limit && RefList.current) {
      RefList.current.addEventListener('scroll', handleScrollItems);
    }

    return () => {
      const { current } = RefList;
      current && current.removeEventListener("scroll", handleScrollItems);
    }
  }, [RefList, props, handleScrollItems]);

  return (
    <section>
      <Modal
        in={Display}
        toggleModal={toggle}
        content={() => (
          <div
            className="fixed inset-0 bg-white mx-auto"
            style={{
              minWidth: '300px',
              maxWidth: '375px'
            }}
          >
              <div
                className="flex flex-col h-full pt-0 px-4 pb-4"
              >
                <section
                  className="sticky py-4 flex items-center text-lg"
                >
                  <ArrowBack
                    className="mr-2 cursor-pointer"
                    onClick={() => toggle()}
                  />
                  <h6 className="truncate">
                    {
                      props.titleModal ||
                      props.label
                    }
                  </h6>
                </section>
                {props?.isSearch && (
                  <section id="inputSearch" className="sticky">
                    <TextField
                      name={'search'}
                      label={`${props?.labelSearch || 'Search'} ${props?.label}`}
                      InputLabelProps={{ shrink: true }}
                      margin="normal" 
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search />
                          </InputAdornment>
                        ),
                      }}
                      fullWidth
                      onChange={onChangeSearch}
                    />
                  </section>
                )}
                {(ErrorMessage?.message) ? (
                  <div className="flex-1">
                    <ErrorWrapper error={ErrorMessage} />
                  </div>
                ) : (
                  <section
                    id="inputlist"
                    className="h-full mt-4 overflow-y-auto flex"
                    ref={RefList}
                  >
                    {(props?.loading) ? (
                      <Spinner
                        size={1}
                        className="flex-1 justify-center items-center"
                        error={ErrorMessage}
                      />
                    ) : (
                      <>
                        {Options && (
                          <ul
                            id="input-list"
                            className="input-list p-0 m-0 flex-1"
                          >
                            {(
                              Selected && props?.limit &&
                                props?.optionLabel(Selected)?.toLowerCase()
                                  ?.indexOf(SearchValue?.toLowerCase()) !== -1
                              ) && (
                              <li
                                id={`list-item-${props?.valueKey ? props?.valueKey(Selected) : 'selected'}`}
                                className={`flex list-none py-4 px-2 justify-between
                                  cursor-pointer border-gray-300 border-b ${isSelected(Selected) && 'bg-gray-300'}`
                                }
                                onClick={() => onClick(Selected,
                                  `list-item-${props?.valueKey ? props?.valueKey(Selected) : 'selected'}`
                                )}
                                key={`list-item-${props?.valueKey ? props?.valueKey(Selected) : 'selected'}`}
                              >
                                <div className="flex-1">
                                  {
                                    props.optionLabel
                                      ? props.optionLabel(Selected)
                                      : Selected
                                  }
                                </div>
                                {isSelected(Selected) && (
                                  <div>
                                    <CheckCircle style={{color: '#128c7e'}} />
                                  </div>
                                )}
                              </li>
                            )}
                            {Options
                              ?.filter((el) => (Selected && props?.limit)
                                ? props?.valueKey
                                  ?(props?.valueKey(el) !== props?.valueKey(Selected))
                                  : (el !== Selected)
                                : true
                              )
                              ?.map((el, idx) => {
                                const id = `list-item-${props?.valueKey ? props?.valueKey(el) : idx}`
                                return (
                                  <li
                                    id={id}
                                    className={`flex list-none py-4 px-2 justify-between
                                      cursor-pointer border-gray-300 border-b ${isSelected(el) && 'bg-gray-300'}`
                                    }
                                    onClick={() => onClick(el, id)}
                                    key={idx}
                                  >
                                    <div>
                                      {
                                        props.optionLabel
                                          ? props.optionLabel(el)
                                          : el
                                      }
                                    </div>
                                    {isSelected(el) && (
                                      <div>
                                        <CheckCircle style={{color: '#128c7e'}} />
                                      </div>
                                    )}
                                  </li>
                                )}
                              )
                            }
                          </ul>
                        )}
                      </>
                    )
                  }
                  </section>
                )}
              </div>
          </div>
        )}
    >
      {() => (
          <TextField
            name={props.name}
            label={props.label}
            InputLabelProps={{ shrink: true }}
            value={(props.optionLabel && Selected)
              ? props.optionLabel(Selected)
              : Selected
            }
            isRequired={props.isRequired}
            InputProps={{
              readOnly: true,
              autoComplete: "off",
            }}
            inputProps={{
              className: "cursor-pointer"
            }}
            readOnly
            fullWidth
            endIcon={(<ChevronRight fontSize="small" />)}
            onClick={() => toggle()}
          />
      )}
      </Modal>
    </section>
  )
}