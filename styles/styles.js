import styled from "styled-components/native";

export const Title = styled.Text`
  fontsize: 24;
  padding: 5px;
  margin: 5px;
`;

export const Subtitle = styled.Text`
  fontsize: 20;
  paddingleft: 5px;
  paddingright: 5px;
  margin: 5px;
`;

export const BodyText = styled.Text`
  fontsize: 16;
  paddingleft: 5px;
  paddingright: 5px;
  margin: 5px;
`;

export const ErrorText = styled.Text`
  fontsize: 14;
  color: red;
  padding: 5px;
  margin: 5px;
`;

export const InputTextBox = styled.TextInput`
  fontsize: 14;
  borderwidth: 1;
  padding: 5px;
  margin: 5px;
`;

export const InputPostTextBox = styled.TextInput`
  fontsize: 14;
  borderwidth: 1;
  padding: 5px;
  margin: 5px;
  height: 60;
  borderradius: 3px;
`;

export const PostTextBox = styled.Text`
  fontsize: 14;
  padding: 5px;
  margin: 5px;
  bordercolor: black;
  borderwidth: 1;
  borderradius: 3px;
`;

export const LoadingView = styled.View`
  flex: 1;
  flexdirection: "column";
  justifycontent: "center";
  alignitems: "center";
`;
