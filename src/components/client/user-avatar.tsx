import { mVs } from '@/src/utils/scale'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

interface UserAvatarProps {
  name: string
}

const UserAvatar: React.FC<UserAvatarProps> = ({ name }) => {

  const getInitials = (fullName: string): string => {
    if (!fullName) return 'NA'

    const nameParts = fullName.trim().split(' ').filter(Boolean)

    if (nameParts.length === 1) {
      return nameParts[0][0].toUpperCase()
    }

    return (
      nameParts[0][0] + nameParts[nameParts.length - 1][0] ).toUpperCase()
  }

  return (
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>
        {getInitials(name)}
      </Text>
    </View>
  )
}

export default UserAvatar

const styles = StyleSheet.create({
  avatar: {
    height: mVs(55),
    width: mVs(55),
    borderRadius: mVs(50),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2E4057',
    borderWidth: 4,
    borderColor: 'grey'
  },
  avatarText: {
    fontSize: mVs(24),
    fontWeight: 'bold',
    color: '#fff'
  }
})