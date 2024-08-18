import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { View, Text, TouchableOpacity } from 'react-native'
import { Button, Input } from '@rneui/themed'
import { Session } from '@supabase/supabase-js'
import { router } from 'expo-router'

export default function Home({ session }: { session: Session }) {
  const [todos, setTodos] = useState<{ id: any; todo: any; created_at: any; }[]>([])

  useEffect(() => {
    if (session) getTodos()
  }, [session])

  async function getTodos() {
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

  return (
    <View className='py-10 bg-neutral-700'>
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

      <View>
        <Button title="Create New Todo" onPress={() => gotToCreateTodo()} />
      </View>
      <View>
        <Button title="Sign Out" onPress={() => logout()} />
      </View>
    </View>
  )
}
