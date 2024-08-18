import { View, Text, TextInput } from 'react-native'
import React, { useEffect } from 'react'
import { supabase } from '../../lib/supabase';
import { Session } from '@supabase/supabase-js';
import { Button } from '@rneui/themed';
import { router } from 'expo-router';
import Home from './Home';

const CreateTodo = () => {
    const [todo, setTodo] = React.useState('');
    const [session, setSession] = React.useState<Session | null>(null)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
        })
    }, [])

    function sendTodo() {
        // @ts-ignore
        supabase.from('todos').insert({ todo, from: session.user.id }).then(({ data, error }) => {
            if (error) {
                console.error('error', error)
                return
            }
            console.log(data)
            router.navigate("/");
        })
    }

    return (
        <View className='py-10 bg-neutral-700'>
        <Text>CreateTodo</Text>
        <TextInput placeholder="Enter your todo" 
        value={todo}
        onChangeText={setTodo}
        />
        <Button onPress={sendTodo} title={"Create Todo"}>Create Todo</Button>
        </View>
    )
    }

export default CreateTodo