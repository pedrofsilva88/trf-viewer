import { createContext, useEffect } from 'react'
import sqlite3InitModule, { Sqlite3 } from '@sqlite.org/sqlite-wasm'

export const Sqlite3Context = createContext<Sqlite3 | undefined>(undefined)

export const useSqliteInitEffect = (setSqlite3: React.Dispatch<React.SetStateAction<Sqlite3 | undefined>>) =>
  useEffect(() => {
    sqlite3InitModule().then((sqlite3) => {
      console.log('Loaded sqlite3', (sqlite3 as unknown as { version: object }).version)
      setSqlite3(sqlite3)
    })
    return () => {
      console.log('Unloading sqlite3???')
    }
  }, [setSqlite3])
