     import React from 'react';
     import { Loader } from '@strapi/design-system';
     import styled from 'styled-components';

     const CenteredLoaderWrapper = styled.div`
       display: flex;
       justify-content: center;
       align-items: center;
       height: 100vh; /* Adjust the height as needed */
     `;

     const CenteredLoader = () => (
       <CenteredLoaderWrapper>
         <Loader>Loading...</Loader>
       </CenteredLoaderWrapper>
     );

     export default CenteredLoader;