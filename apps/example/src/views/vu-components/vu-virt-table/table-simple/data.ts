export type TableSimpleItem = {
  id: number
  isExpandable: boolean
  name: string
  name1: string
  name2: string
  name3: string
  name4: string
  name5: string
  name6: string
  name7: string
  dateCreate: string
  date: {
    create: string
  }
}

const getRandomDate = () => {
  const start = new Date(2020, 0, 1).getTime()
  const end = new Date()
  return new Date(start + Math.random() * (end.getTime() - start)).toISOString()
}

let id = 0
export const generateItem = (name: string = ''): TableSimpleItem => ({
  id: id++,
  isExpandable: Math.random() > 0.5,
  name: `${name ? name + ' - ' : ''}Name ${Math.floor(Math.random() * 1000)}`,
  name1: `Name ${Math.floor(Math.random() * 1000)}`,
  name2: `Name ${Math.floor(Math.random() * 1000)}`,
  name3: `Name ${Math.floor(Math.random() * 1000)}`,
  name4: `Name ${Math.floor(Math.random() * 1000)}`,
  name5: `Name ${Math.floor(Math.random() * 1000)}`,
  name6: `Name ${Math.floor(Math.random() * 1000)}`,
  name7: `Name ${Math.floor(Math.random() * 1000)}`,
  dateCreate: getRandomDate(),
  date: {
    create: getRandomDate()
  }
})
