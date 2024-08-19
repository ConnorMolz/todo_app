import { View, Text, TextInput, Button, Alert } from 'react-native'
import React from 'react'
import { supabase } from '@/lib/supabase'
import { router } from 'expo-router'

const CreateAccount = () => {

    const [ email, setEmail ] = React.useState('')
    const [ password, setPassword ] = React.useState('')

    async function createAccount() {
        const {
          data: { session },
          error,
        } = await supabase.auth.signUp({
          email: email,
          password: password,
        })
    
        if (error) Alert.alert(error.message)
        if (!session){ 
            const alert = Alert.alert('Please check your inbox for email verification!')
            router.navigate('/');
        }
      }

    return (
        <View className='py-10 bg-neutral-700 flex-1'>
        <Text className='text-white text-4xl justify-center text-center pt-10'>CreateAccount</Text>

            <View className='pt-10 pb-5'>
                <TextInput placeholder="Enter your email" 
                    className='bg-white p-2 m-2 scroll-py-10'
                    editable={true}
                    autoCapitalize='none'
                    keyboardType='email-address'
                    onChangeText={setEmail}
                    value={email}
                />
            </View>
            <View className='pb-10'>
                <TextInput 
                    placeholder="Enter your password"
                    className='bg-white p-2 m-2 scroll-py-10'
                    secureTextEntry={true}
                    editable={true}
                    autoCapitalize='none'
                    maxLength={64}
                    onChangeText={setPassword}
                    value={password}
                />
            </View>
            <View className='py-10'>
                <Button title="Create Account" onPress={() => {createAccount()}} />
            </View>

        </View>
    )
}

export default CreateAccount