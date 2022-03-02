import styled from "styled-components/native";

export const Container = styled.View `
  margin: 10px;
`;

export const Title = styled.Text `
  fontSize: 24px;
  padding: 5px;
  margin: 5px;
`;

export const Subtitle = styled.Text `
  fontSize: 20px;
  paddingLeft: 5px;
  paddingRight: 5px;
  margin: 5px;
`;

export const BodyText = styled.Text `
  fontSize: 16px;
  paddingLeft: 5px;
  paddingRight: 5px;
  margin: 5px;
`;

export const ErrorText = styled.Text `
  fontSize: 14px;
  color: red;
  padding: 5px;
  margin: 5px;
`;

export const InputTextBox = styled.TextInput `
  fontSize: 14px;
  borderWidth: 1px;
  padding: 5px;
  margin: 5px;
  borderRadius: 5px;
`;

export const InputPostTextBox = styled.TextInput `
  fontSize: 14px;
  borderWidth: 1px;
  padding: 5px;
  margin-top: 5px;
  margin-left: 5px;
  margin-right: 5px;
  height: 60px;
  borderRadius: 5px;
`;

export const PostTextBox = styled.Text `
  fontSize: 14px;
  padding: 5px;
  margin: 5px;
  borderColor: black;
  borderWidth: 1px;
  borderRadius: 5px;
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
  fontSize: 18px;
  color: white;
`;

export const DeletePostButton = styled.TouchableOpacity `
  backgroundColor: transparent;
  padding: 5px;
`;

export const EditPostButton = styled.TouchableOpacity `
  backgroundColor: transparent;
  padding: 5px;
`;

export const LikePostButton = styled.TouchableOpacity `
  backgroundColor: transparent;
  padding: 5px;
`;

export const RemoveLikePostButton = styled.TouchableOpacity `
  backgroundColor: transparent;
  padding: 5px;
`;

export const PostButton = styled.TouchableOpacity `
  backgroundColor: teal;
  borderRadius: 8px;
  padding: 5px;
`;


export const ButtonText = styled.Text `
  fontSize: 16px;
  color: white;
`;