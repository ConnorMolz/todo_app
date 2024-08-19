import { View, Text, TextInput } from 'react-native'
import React, { useEffect } from 'react'
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';
import { Button } from '@rneui/themed';
import { router } from 'expo-router';

const CreateTodo = () => {
    const [todo, setTodo] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [session, setSession] = React.useState<Session | null>(null)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
        })
    }, [])

    function sendTodo() {
        // @ts-ignore
        supabase.from('todos').insert({ todo, from: session.user.id, description }).then(({ data, error }) => {
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
            <Button onPress={sendTodo} title={"Create Todo"}>Create Todo</Button>
        </View>
    )
    }

export default CreateTodo