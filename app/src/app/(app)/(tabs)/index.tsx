import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Appbar, Avatar, List, FAB, Searchbar, Chip, Portal, Modal } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useSession } from '../../../ctx';
import { useJournal } from '../../../hooks/useJournals';
import {timeAgo} from '../../../utils'

const Item = ({ id, title, content, created_at }) => {
    const category = title.slice(0, 3)
    const date = timeAgo(created_at)
    return <List.Item
        title={title}
        description={content}
        left={props => <Avatar.Text size={40} label={category} />}
        right={props => <View style={styles.right}><List.Icon {...props} icon="star-outline" /><List.Subheader>{date}</List.Subheader></View>}
    />
}

export default function Dashboard() {
    const { signOut } = useSession();
    const { journals } = useJournal()
    const [modalVisible, setModalVisible] = React.useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    const onChangeSearch = query => setSearchQuery(query);

    const handleReload = () => {
        signOut()
    }

    return (
        <>
            <Appbar.Header>
                <Appbar.Content title="Journals" />
                {/* <Appbar.Action icon="magnify" onPress={() => { }} /> */}
                <Appbar.Action icon="refresh" onPress={handleReload} />
            </Appbar.Header>
            <Appbar.Header>
                <View style={styles.chipContainer} className="gap-2">
                    <Chip onPress={() => console.log('Pressed')}>Info</Chip>
                    <Chip onPress={() => console.log('Pressed')}>Starred</Chip>
                    <Chip onPress={() => console.log('Pressed')}>Emails</Chip>
                </View>
            </Appbar.Header>
            <View className='p-1'>
                <FlatList
                    data={journals}
                    renderItem={({ item }) => <Item {...item} />}
                    keyExtractor={item => item.id}
                />
            </View>

            <FAB
                style={styles.fab}
                icon="plus"
                onPress={() => { router.navigate('/(app)/new_journal') }}
                label="New Journal"
            />

        </>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
    right: {
        flexDirection: 'column',
        alignItems: 'flex-end',
    },
    searchbar: {
        margin: 1,
    },
    chipContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
});
