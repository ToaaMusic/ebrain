// supabase/utils.ts
import { supabase } from '../lib/supabase'

export async function getEnumValues(enumName: string): Promise<string[]> {
  const { data, error } = await supabase.rpc('get_enum_values', {
    enum_name: enumName,
  })
  if (error) {
    console.error(error)
    return []
  }
  return data
}
