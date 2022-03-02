import styled from "styled-components/native";

export const Title = styled.Text `
  fontSize: 24;
  padding: 5px;
  margin: 5px;
`;

export const Subtitle = styled.Text `
fontSize: 20;
  paddingLeft: 5px;
  paddingRight: 5px;
  margin: 5px;
`;

export const BodyText = styled.Text `
fontSize: 16;
  paddingLeft: 5px;
  paddingRight: 5px;
  margin: 5px;
`;

export const ErrorText = styled.Text `
  fontSize: 14;
  color: red;
  padding: 5px;
  margin: 5px;
`;

export const InputTextBox = styled.TextInput `
  fontSize: 14;
  borderWidth: 1;
  padding: 5px;
  margin: 5px;
`;

export const InputPostTextBox = styled.TextInput `
  fontSize: 14;
  borderWidth: 1;
  padding: 5px;
  margin: 5px;
  height: 60;
  borderRadius: 3px;
`;

export const PostTextBox = styled.Text `
  fontSize: 14;
  padding: 5px;
  margin: 5px;
  borderColor: black;
  borderWidth: 1;
  borderRadius: 3px;
`;

export const LoadingView = styled.View `
  flex: 1;
  flexDirection: "column";
  justifyContent: "center";
  alignItems: "center";
`;

export const ProfileContainer = styled.View `
  alignItems: center;
  flexDirection: row;
`;

export const PostInfoContainer = styled.View `
  display: flex;
  flexDirection: row;
`;

export const ProfilePhoto = styled.Image `
  width: 100px;
  height: 100px;
  borderRadius: 50px;
  padding: 5px;
  margin: 5px;
`;

export const TakePhotoContainer = styled.View `
  flex: 1;
`;

export const TakePhotoButtonContainer = styled.View `
  flex: 1;
  backgroundColor: transparent;
  flexDirection: row;
  margin: 20px;
`;

export const TakePhotoButton = styled.TouchableOpacity `
  flex: 0.1;
  alignSelf: flex-end;
  alignItems: center;
`;

export const TakePhotoText = styled.Text `
  fontSize: 18;
  color: white;
`;

export const PostInteractionButton = styled.TouchableOpacity `
  backgroundColor: transparent;
  padding: 5px;
`;

export const LikePostButton = styled.TouchableOpacity `
  backgroundColor: transparent;
  color: red;
  padding: 5px;
`;

export const PostButtonContainer = styled.View `
  flexDirection: row;
`;
