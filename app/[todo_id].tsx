import { View, Text, TextInput, Button, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { router, useLocalSearchParams } from 'expo-router';

const UpdateTodo = () => {
    const { todo_id } = useLocalSearchParams();
    console.log(todo_id)
    const [todo, setTodo] = useState('');
    const [description, setDescription] = useState('');
    const [session, setSession] = useState<Session | null>(null)

    useEffect(() => {
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            setSession(session)
            // @ts-ignore
            await getTodo(todo_id)
        })
    }, [])

    async function getTodo(id :number) {
         const { data, error } = await supabase.from('todos').select('todo, description').eq('id', id);
         if (error) {
            console.error('error', error);
            return '';
         }
         console.log(data);
         setTodo(data[0].todo);
         setDescription(data[0].description);
    }

    function updateTodo(){
        if(!todo) {
            Alert.alert("The todo can not be empty");
            return;
        }
        supabase.from('todos').update({ todo: todo, description: description }).eq('id', todo_id).eq("from", session?.user.id).then(({ data, error }) => {
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


    return (
        <View className='py-10 bg-neutral-700 flex-1'>
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
        <View className='justify-between flex-row text-justify'>
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
    </View>
    )
}

export default UpdateTodo