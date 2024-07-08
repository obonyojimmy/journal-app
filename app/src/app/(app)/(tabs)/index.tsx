import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Appbar, Avatar, List, FAB, Searchbar, Chip, Portal, Menu } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useSession } from '../../../ctx';
import { useJournal } from '../../../hooks/useJournals';
import { timeAgo } from '../../../utils'
import JournalItem from '../../../components/JournalItem'

export default function Dashboard() {
    const router = useRouter();
    const { signOut } = useSession();
    const { journals, categories, filterJournals } = useJournal()
    const [filterVisible, setFilterVisible] = useState(false);
    const [categoryFilter, setcategoryFilter] = useState(null);
    const [dateFilter, setdateFilter] = useState(null);



    const handleOpenFilterMenu = () => {
        setFilterVisible(true)
    }

    const handleReload = async () => {
        setcategoryFilter(null)
        setdateFilter(null)
        await filterJournals(null, null)
    }

    const handleCategoryFilter = async (category_id: string) => {
        if (!category_id) {
            setcategoryFilter(null)
            await filterJournals(null, dateFilter)
        } else {
            setcategoryFilter(category_id)
            await filterJournals(category_id, dateFilter)
        }
    }

    const handleDateFilter = async (dateTag: string) => {
        if (!dateTag) {
            setdateFilter(null)
            await filterJournals(categoryFilter, null)
        } else {
            setdateFilter(dateTag)
            await filterJournals(categoryFilter, dateTag)
        }
    }

    return (
        <>
            <Appbar.Header>
                <Appbar.Content title="Journals" />
                <Appbar.Action icon="refresh" onPress={handleReload} />
                <Menu
                    visible={filterVisible}
                    onDismiss={() => { setFilterVisible(false) }}
                    anchor={<Appbar.Action icon="filter" onPress={handleOpenFilterMenu} />}
                    anchorPosition='bottom'
                >
                    <Menu.Item onPress={() => handleDateFilter(null)} title="All" />
                    <Menu.Item onPress={() => handleDateFilter('today')} title="Today" />
                    <Menu.Item onPress={() => handleDateFilter('week')} title="This week" />
                    <Menu.Item onPress={() => handleDateFilter('month')} title="This month" />
                    <Menu.Item onPress={() => handleDateFilter('year')} title="This Year" />
                </Menu>

            </Appbar.Header>
            <Appbar.Header>
                <View style={styles.chipContainer} className="gap-2">
                    <Chip selected={!categoryFilter} onPress={() => handleCategoryFilter(null)}>All</Chip>
                    {
                        categories.map(cat => {
                            return <Chip
                                key={cat.id}
                                selected={cat.id === categoryFilter}
                                onPress={() => handleCategoryFilter(cat.id)}
                            >{cat.name}</Chip>
                        })
                    }
                </View>
            </Appbar.Header>

            <View className='p-1'>
                <FlatList
                    data={journals}
                    renderItem={({ item }) => <JournalItem key={item.id} {...item} />}
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
