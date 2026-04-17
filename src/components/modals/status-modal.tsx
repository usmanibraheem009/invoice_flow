import React from 'react'
import { StyleSheet, Text } from 'react-native'
import ModalWrapper from '../layout/modal-wrapper'

const StatusModal = () => {
    return (
        <ModalWrapper visible={false} labelKey={''} valueKey={''} onClose={function (): void {
            throw new Error('Function not implemented.')
        }}>
            <Text></Text>
        </ModalWrapper>
    )
}

export default StatusModal

const styles = StyleSheet.create({})