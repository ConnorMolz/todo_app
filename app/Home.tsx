import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { Button, Input } from '@rneui/themed'
import { Session } from '@supabase/supabase-js'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Home() {
  const [session, setSession] = useState<Session | null>(null)
  const [todos, setTodos] = useState<{ id: any; todo: any; created_at: any; }[]>([])

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
        await setSession(session)
    })
    }, [])
  
  useEffect(() => {
    if (session) getTodos()
  }, [session])

  async function getTodos() {
    if(!session)setTimeout(() => getTodos(), 1000)
    // @ts-ignore
    supabase.from('todos').select("id, todo, created_at").eq('from', session.user.id).eq('done', false).then(({ data, error }) => {
      if (error) {
        console.error('error', error)
        return
      }
      console.log(data)
      setTodos(data)
    })
}

  function logout() {
    supabase.auth.signOut(); 
    router.navigate("/")
  }

  function markAsDone(id: any) {
    supabase.from('todos').update({ done: true }).eq('id', id).then(({ data, error }) => {
      if (error) {
        console.error('error', error)
        return
      }
      console.log(data)
      getTodos()

    })
  }

  function gotToCreateTodo() {
      router.navigate("/CreateTodo")
  }

  function goToTodo(id:number){
    router.navigate(`/${id}`)
  }

  function goToAllTodos(){
    router.navigate("/all_todos")
  }

  return (
    <View>
    <ScrollView className='py-10 bg-neutral-700' stickyHeaderHiddenOnScroll={false} invertStickyHeaders={true}>
      <SafeAreaView className='flex-1'>
      {
        todos.map((todo) => (
          <TouchableOpacity key={todo.id} className='flex-row justify-between bg-neutral-600 p-5 m-5 rounded-lg' onPress={() =>goToTodo(todo.id)} >
            <View>
              <Text className='text-neutral-100 text-xl'>{todo.todo}</Text>
              <Text className='text-neutral-300'>{new Date(todo.created_at).toLocaleString()}</Text>
            </View>
            <Button title="Done" onPress={() => { markAsDone(todo.id)}} />
          </TouchableOpacity>
        ))
      }
      <View className='justify-end  flex-row align-bottom place-content-end'>
      <View>
        <Button title="Create New Todo" onPress={() => gotToCreateTodo()} />
      </View>
      <View>
        <Button title="Show all Todos" onPress={() => goToAllTodos()} />
      </View>
      <View className='pb-10'>
        <Button title="Sign Out" onPress={() => logout()} />
      </View>
      </View>
      </SafeAreaView>
    </ScrollView>
    </View>
  )
}
