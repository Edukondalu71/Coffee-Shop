import React from 'react';
import {StyleSheet, Image, View} from 'react-native';
import {COLORS, SPACING} from '../theme/theme';

const ProfilePic = () => {
  return (
    <View style={styles.ImageContainer}>
      <Image
        source={require('../assets/app_images/avatar.png')}
        style={styles.Image}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  ImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  Image: {
    height: 42,
    width: 50,
  },
});

export default ProfilePic;
