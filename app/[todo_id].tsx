import { View, Text, TextInput, Button, Alert, Modal, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { router, useLocalSearchParams } from 'expo-router';
import { CheckBox, Input } from 'react-native-elements';
import { DataTable } from 'react-native-paper';

const UpdateTodo = () => {
    const { todo_id } = useLocalSearchParams();
    console.log(todo_id)
    const [todo, setTodo] = useState('');
    const [description, setDescription] = useState('');
    const [session, setSession] = useState<Session | null>(null)
    const [tableData, setTableData] = React.useState<{ entryName: string, entryDescription: string, entryChecked: boolean }[]>([]);
    const [hasTable, setHasTable] = React.useState(false);

    const [isPopUpOpen, setIsPopUpOpen] = React.useState(false);
    const [entryName, setEntryName] = React.useState('');
    const [entryDescription, setEntryDescription] = React.useState('');
    const [entryChecked, setEntryChecked] = React.useState(false);

    useEffect(() => {
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            setSession(session)
            // @ts-ignore
            await getTodo(todo_id)
        })
    }, [])

    async function getTodo(id :number) {
         const { data, error } = await supabase.from('todos').select('todo, description, table').eq('id', id);
         if (error) {
            console.error('error', error);
            return '';
         }
         console.log(data);
         setTodo(data[0].todo);
         setDescription(data[0].description);
         setTableData(data[0].table);
         if(data[0].table.length > 0) {
             setHasTable(true);
         }
    }

    function updateTodo(){
        if(!todo) {
            Alert.alert("The todo can not be empty");
            return;
        }
        supabase.from('todos').update({ todo: todo, description: description, table: tableData }).eq('id', todo_id).eq("from", session?.user.id).then(({ data, error }) => {
            if (error) {
                console.error('error', error)
                return
            }
            console.log(data)
            router.navigate("/");
        })
    }

    function deleteTodo(){
        supabase.from('todos').delete().eq('id', todo_id).eq("from", session?.user.id).then(({ data, error }) => {
            if (error) {
                console.error('error', error)
                return
            }
            console.log(data)
            router.navigate("/");
        })
    }

    function createTable() {
        setHasTable(true);
        console.log("WIP")
    }

    function openPopUp() {
        setIsPopUpOpen(true);
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
        <Text className='text-4xl text-white text-center py-16'>Update Todo</Text>
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
                !hasTable && <Button onPress={createTable} title="Add table"></Button>
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
                    <Button onPress={openPopUp} title="Add item"></Button>
                    <Modal
                        animationType='slide'
                        visible={isPopUpOpen}
                        onRequestClose={() => addTableItem()}
                        >
                        <View>
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
                            <Button onPress={addTableItem} title="Add item"></Button>
                        </View>
                    </Modal>
                </View>
            }
        <View className='justify-between flex-row text-justify py-10'>
            <View className='' >
                <Button title="Update Todo" onPress={updateTodo} />
            </View>
            <View>
                <Button title="Go Back" onPress={() => router.navigate("/")} />
            </View>
            <View>
                <Button title="Delete Todo" onPress={() => deleteTodo()} />
            </View>
            </View>
    </ScrollView>
    )
}

export default UpdateTodo