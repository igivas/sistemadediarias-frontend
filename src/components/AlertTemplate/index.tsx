import React from 'react';
import { FaInfo, FaCheck, FaTimesCircle, FaTimes } from 'react-icons/fa';
const customStyles: any = {
  success: {
    backgroundColor: '#48b461',
    fontWeight: 500,
    color: 'white',
    padding: '10px',

    borderRadius: '3px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0px 2px 2px 2px rgba(0, 0, 0, 0.03)',
    fontFamily: 'Arial',
    width: '300px',
    minHeight: '80px',
    boxSizing: 'border-box',
  },
  info: {
    backgroundColor: '#ffbe38',
    fontWeight: 500,
    color: '#000',
    padding: '10px',

    borderRadius: '3px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0px 2px 2px 2px rgba(0, 0, 0, 0.03)',
    fontFamily: 'Arial',
    width: '300px',
    minHeight: '80px',
    boxSizing: 'border-box',
  },
  error: {
    backgroundColor: 'red',
    fontWeight: 500,
    color: 'white',
    padding: '10px',

    borderRadius: '3px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0px 2px 2px 2px rgba(0, 0, 0, 0.03)',
    fontFamily: 'Arial',
    width: '300px',
    minHeight: '80px',
    boxSizing: 'border-box',
  },
};


const buttonStyle: any = {
  success: {
    marginLeft: '20px',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    color: '#fff',
  },
  error: {
    marginLeft: '20px',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    color: '#fff',
  },

  info: {
    marginLeft: '20px',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    color: '#000',
  },
};

const AlertTemplate = ({ message, options, style, close }: any) => {
  return (
    <div style={{ ...customStyles[options.type], ...style }}>
      {options.type === 'info' && <FaInfo color="black" size={25} />}
      {options.type === 'success' && <FaCheck color="white" size={25} />}
      {options.type === 'error' && <FaTimesCircle color="white" size={25} />}
      <span style={{ flex: 2, marginLeft: 8 }}>{message}</span>
      <button onClick={close} style={buttonStyle[options.type]}>
        <FaTimes />
      </button>
    </div>
  );
};

export default AlertTemplate;
