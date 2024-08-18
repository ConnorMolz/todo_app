import { View, Text, TextInput, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { router, useLocalSearchParams } from 'expo-router';

const UpdateTodo = () => {
    const { todo_id } = useLocalSearchParams();
    console.log(todo_id)
    const [todo, setTodo] = useState('');
    const [session, setSession] = useState<Session | null>(null)

    useEffect(() => {
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            setSession(session)
            // @ts-ignore
            setTodo(await getTodo(parseInt(todo_id)))
        })
    }, [])

    async function getTodo(id :number): Promise<string> {
         const { data, error } = await supabase.from('todos').select('todo').eq('id', id);
         if (error) {
            console.error('error', error);
            return '';
         }
         console.log(data);
         return data[0].todo;
    }

    function updateTodo(){
        supabase.from('todos').update({ todo: todo }).eq('id', todo_id).then(({ data, error }) => {
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
                multiline={true}
                editable={true}
                numberOfLines={5}
            />
        </View>
        <Button title="Update Todo" onPress={updateTodo} />
    </View>
    )
}

export default UpdateTodo