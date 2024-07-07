import React, { useState } from 'react';
import { router } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar, List, } from 'react-native-paper';
import { timeAgo } from '../utils'
import {Journal} from '../api'

export default function JournalItem({ id, title, content, created_at }: Journal) {
    const category = title.slice(0, 3)
    const date = timeAgo(created_at)
    const handleOnPress = () => {
        router.navigate({ pathname: 'journal', params: { id, title, date, category } })
    }
    return (
        <List.Item
            title={title}
            description={content}
            style={styles.listItem}
            onPress={handleOnPress}
            left={props => <Avatar.Text size={40} label={category} />}
            right={props => <View style={styles.right}><List.Icon {...props} icon="star-outline" /><List.Subheader>{date}</List.Subheader></View>}
        />
    )
}

const styles = StyleSheet.create({
    right: {
        flexDirection: 'column',
        alignItems: 'flex-end',
    },
    listItem: {
        borderBottomColor: 'grey',
        borderBottomWidth: 1,
    }
});
