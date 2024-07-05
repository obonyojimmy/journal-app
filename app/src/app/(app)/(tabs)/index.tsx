import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Appbar, Avatar, List, FAB, Searchbar, Chip, Portal, Modal } from 'react-native-paper';
import { useRouter } from 'expo-router';

const DATA = [
    { id: '1', name: 'Hermann, Pfannel & Schumm', date: '29.1.2021', message: 'Cras mi pede, malesuada in, imperdiet e...', avatar: 'H' },
    { id: '2', name: 'Ziemann, Lockman and Kuvalis', date: '5.9.2020', message: 'Vivamus vestibulum sagittis sapien. Cu...', avatar: 'J' },
    { id: '3', name: 'Daniel, Kuhn and Wolf', date: '13.6.2020', message: 'Aenean fermentum. Donec ut mauris eg...', avatar: 'Y' },
    { id: '4', name: 'Crona, Lind and Stoltenberg', date: '20.5.2020', message: 'Quisque erat eros, viverra eget, congue ...', avatar: 'W' },
    { id: '5', name: 'Bashirian-Hudson', date: '21.9.2020', message: 'Fusce congue, diam id ornare imperdiet, ...', avatar: 'V' },
    { id: '6', name: 'Schmitt-Jacobs', date: '2.6.2020', message: 'Integer aliquet, massa id lobortis convall...', avatar: 'M' },
    { id: '7', name: 'Graham-Champlin', date: '17.10.2020', message: 'Vestibulum ante ipsum primis in faucib...', avatar: 'T' },
    { id: '8', name: 'Schoen, Carroll and Herzog', date: '31.10.2020', message: 'Ut tellus. Nulla ut erat id mauris vulputa...', avatar: 'F' },
    { id: '9', name: 'Pouros-Fay', date: '6.1.2021', message: 'Donec semper sapien a libero. Nam dui...', avatar: 'Z' },
];

const Item = ({ name, date, message, avatar }) => (
    <List.Item
        title={name}
        description={message}
        left={props => <Avatar.Text size={40} label={avatar} />}
        right={props => <View style={styles.right}><List.Icon {...props} icon="star-outline" /><List.Subheader>{date}</List.Subheader></View>}
    />
);

export default function Dashboard() {
    const [modalVisible, setModalVisible] = React.useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    const onChangeSearch = query => setSearchQuery(query);

    return (
        <>
            <Appbar.Header>
                <Appbar.Content title="Journals" />
                {/* <Appbar.Action icon="magnify" onPress={() => { }} /> */}
                <Appbar.Action icon="logout" onPress={() => { }} />
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
                    data={DATA}
                    renderItem={({ item }) => <Item {...item} />}
                    keyExtractor={item => item.id}
                />
            </View>

            <FAB
                style={styles.fab}
                icon="plus"
                onPress={() => {  router.navigate('/(app)/new_journal')}}
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
