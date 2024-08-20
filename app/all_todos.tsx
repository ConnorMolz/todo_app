import { View, Text, Button, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Session } from '@supabase/supabase-js'
import { router } from 'expo-router'

const all_todos = () => {

    const [session, setSession] = React.useState<Session | null>(null)
    const [todos, setTodos] = React.useState<{ id: any; todo: any; created_at: any; description: any, done:any }[]>([])

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
        const { data, error } = await supabase.from('todos').select('todo, description, id, done, created_at').eq('from', session?.user.id);
        if (error) {
           console.error('error', error);
           return [];
        }
        console.log(await data);
        setTodos(await data);
    }

   function markAsUndone(id: any) {
    supabase.from('todos').update({ done: false }).eq('id', id).then(({ data, error }) => {
      if (error) {
        console.error('error', error)
        return
      }
      console.log(data)
      getTodos()

    })
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

  function goToTodo(id:number){
    router.navigate(`/${id}`)
  }

  return (
    <ScrollView>
      <Text className='text-4xl text-white text-center py-16'>All Todos</Text>

      {
        todos.map((todo) => (
          <TouchableOpacity key={todo.id} className='flex-row justify-between bg-neutral-600 p-5 m-5 rounded-lg' onPress={() =>goToTodo(todo.id)} >
            <View>
              <Text className='text-neutral-100 text-xl'>{todo.todo}</Text>
              <Text className='text-neutral-300'>{new Date(todo.created_at).toLocaleString()}</Text>
            </View>
            {todo.done && <Button title="Undone" onPress={() => { markAsUndone(todo.id)}} />}
            {!todo.done && <Button title="Done" onPress={() => { markAsDone(todo.id)}} />}
          </TouchableOpacity>
        ))
      }
      <Button title="Home" onPress={() => router.navigate("/")} />

    </ScrollView>
  )
}

export default all_todos