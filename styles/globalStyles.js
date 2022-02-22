import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    loading: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },

    headerText: {
        fontSize: 18,
        padding: 5,
        margin: 5
    },

    regularText: {
        fontSize: 16,
        padding: 5,
        margin: 5,
    },

    userDataTextBox: {
        padding: 5,
        borderWidth: 1,
        margin: 5
    },

    postTextInput: {
        fontSize: 16,
        padding: 5,
        margin: 5,
        height: 60
    },

    postText: {
        fontSize: 16,
        padding: 5,
        margin: 5,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 2
    },

    profilePhoto: {
        width: 100,
        height: 100,
        borderRadius: 100/ 2,
        padding: 5,
        margin: 5,
    },
});