"use client"
import CodeEditor from '@/components/CodeEditor'
import { Box } from '@chakra-ui/react'
const page = () => {
  return (
    <Box
    minH="100vh"
    bg='#0f0a19'
    color="gray.500">
            <CodeEditor/>
    </Box>
  )
}

export default page
