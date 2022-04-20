import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`



*:focus {
  box-shadow: none !important;
  outline: none;
}

 html {

  height: 100%;
}



body {

  -webkit-font-smoothing: antialiased;
  height: 100%;

}

div#root {
  height: 100%
}




  button {
    cursor: pointer;

  }
`;
