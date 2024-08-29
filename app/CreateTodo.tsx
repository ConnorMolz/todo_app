import { View, Text, TextInput, Alert, Modal, ScrollView } from 'react-native'
import { CheckBox } from 'react-native-elements'
import React, { useEffect } from 'react'
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';
import { Button, Input } from '@rneui/themed';
import { router } from 'expo-router';
import { DataTable } from 'react-native-paper';
import Entypo from 'react-native-vector-icons/Entypo';

const CreateTodo = () => {
    const [todo, setTodo] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [session, setSession] = React.useState<Session | null>(null)
    const [hasTable, setHasTable] = React.useState(false);
    const [tableData, setTableData] = React.useState<{ entryName: string, entryDescription: string, entryChecked: boolean }[]>([]);

    const [isPopUpOpen, setIsPopUpOpen] = React.useState(false);
    const [entryName, setEntryName] = React.useState('');
    const [entryDescription, setEntryDescription] = React.useState('');
    const [entryChecked, setEntryChecked] = React.useState(false);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
        })
    }, [])

    function sendTodo() {
        if(!todo) {
            Alert.alert("The todo can not be empty");
            return;
        }
        if (hasTable) {
        // @ts-ignore
        supabase.from('todos').insert({ todo, from: session.user.id, description, table: tableData }).then(({ data, error }) => {
            if (error) {
                console.error('error', error)
                return
            }
            console.log(data)
        })
            router.navigate("/");
        } 
        else {
            // @ts-ignore
            supabase.from('todos').insert({ todo, from: session.user.id, description }).then(({ data, error }) => {
                if (error) {
                    console.error('error', error)
                    return
                }
                console.log(data)
            })
                router.navigate("/");
        }
    }

    function createTable() {
        setHasTable(true);
        console.log("WIP")
    }

    function openPopUp() {
        setIsPopUpOpen(true);
    }

    function cancelAddTableItem() {
        setEntryChecked(false);
        setEntryName('');
        setEntryDescription('');
        setIsPopUpOpen(false);
    }

    function addTableItem() {
        const newEntry = {
            "entryName": entryName,
            "entryDescription": entryDescription,
            "entryChecked": entryChecked
        };
        setTableData([...tableData, newEntry]);
        setIsPopUpOpen(false);
        setEntryChecked(false);
        setEntryName('');
        setEntryDescription('');
    }

    return (
        <ScrollView className='py-10 bg-neutral-700 flex-1'>
            <Text className='text-4xl text-white text-center py-16'>CreateTodo</Text>
            <View className='justify-center py-10'>
                <TextInput placeholder="Enter your todo" 
                    value={todo}
                    onChangeText={setTodo}
                    className='bg-white p-2 m-2 scroll-py-10'
                    maxLength={40}
                    editable={true}
                />
                <TextInput placeholder="Enter description"
                    value={description}
                    onChangeText={setDescription}
                    className='bg-white p-2 m-2 scroll-py-10'
                    editable={true}
                    multiline={true}
                    numberOfLines={4}
                />
            </View>
            {
                !hasTable && <Button onPress={createTable} title={"Add table"}>Add table</Button>
            }
            {hasTable && 
                <View className='justify-center py-10'>
                    <DataTable>
                        <DataTable.Header>
                            <DataTable.Title><Text>Todo</Text></DataTable.Title>
                            <DataTable.Title><Text>Description</Text></DataTable.Title>
                            <DataTable.Title><Text>Done</Text></DataTable.Title>
                            {/*<DataTable.Title> </DataTable.Title>*/}
                        </DataTable.Header>
                            {tableData.map((item, index) => {
                                return (
                                    <DataTable.Row key={index}>
                                        <DataTable.Cell><Text>{item.entryName}</Text></DataTable.Cell>
                                        <DataTable.Cell><Text>{item.entryDescription}</Text></DataTable.Cell>
                                        <DataTable.Cell><CheckBox checked={item.entryChecked} onPress={() => item.entryChecked = !item.entryChecked} /></DataTable.Cell>
                                        {/*<DataTable.Cell><Button icon={<Entypo name="trash" size={24} color="black" />} onPress={() =>{delete(tableData[index])}}></Button></DataTable.Cell>*/}
                                    </DataTable.Row>
                                )
                            })}
                    </DataTable >
                    <Button onPress={openPopUp} title={"Add item"}>Add item</Button>
                    <Modal
                        animationType='slide'
                        visible={isPopUpOpen}
                        onRequestClose={() => addTableItem()}
                        >
                        <View className='py-10 bg-neutral-700 flex-1'>
                            <Input placeholder="Enter your Entry" 
                                value={entryName}
                                onChangeText={setEntryName}
                                className='bg-white p-2 m-2 scroll-py-10'
                                maxLength={40}
                                editable={true} />
                            <Input placeholder="Enter description"
                                value={entryDescription}
                                onChangeText={setEntryDescription}
                                className='bg-white p-2 m-2 scroll-py-10'
                                editable={true}
                                multiline={true}
                                numberOfLines={4} />
                            <CheckBox 
                                title={"Done"}
                                checked={entryChecked}
                                onPress={() => setEntryChecked(!entryChecked)}
                            />
                            <Button onPress={addTableItem} title={"Add item"}>Add item</Button>
                            <Button onPress={cancelAddTableItem} title={"Cancel"}>Cancel</Button>
                        </View>
                    </Modal>
                </View>
            }
            <View className='flex-1 flex-row justify-evenly py-10'>
                <Button onPress={sendTodo} title={"Create Todo"}>Create Todo</Button>
                <Button onPress={() => router.navigate("/")} title={"Cancel"}>Cancel</Button>
            </View>
        </ScrollView>
    )
    }

export default CreateTodo