import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Appbar, Avatar, List, FAB, Searchbar, Chip, Portal, Menu } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useSession } from '../../../ctx';
import { useJournal } from '../../../hooks/useJournals';
import { timeAgo } from '../../../utils'
import JournalItem from '../../../components/JournalItem'


export default function Dashboard() {
    const { signOut } = useSession();
    const { journals } = useJournal()
    const [filterVisible, setFilterVisible] = React.useState(false);
    const router = useRouter();

    const handleOpenFilterMenu = () => {
        setFilterVisible(true)
    }

    const handleReload = () => {
        signOut()
    }

    return (
        <>
            <Appbar.Header>
                <Appbar.Content title="Journals" />
                <Appbar.Action icon="refresh" onPress={handleReload} />
                <Menu
                    visible={filterVisible}
                    onDismiss={()=> {setFilterVisible(false)}}
                    anchor={<Appbar.Action icon="filter" onPress={handleOpenFilterMenu} />}
                    anchorPosition='bottom'
                >
                    <Menu.Item onPress={() => { }} title="Today" />
                    <Menu.Item onPress={() => { }} title="This week" />
                    <Menu.Item onPress={() => { }} title="This month" />
                </Menu>
                
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
                    renderItem={({ item }) => <JournalItem {...item} />}
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
    listItem: {
        borderBottomColor: 'grey',
        borderBottomWidth: 1,
    }
});
