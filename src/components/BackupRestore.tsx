import { useState } from 'react'
import { VStack, Button, Input, Text, useToast, Card, CardBody, CardHeader, Heading, Divider } from '@chakra-ui/react'
import * as backupService from '../services/backupService'
import { DeleteIcon, DownloadIcon } from '@chakra-ui/icons'

interface BackupRestoreProps {
    onRestoreComplete: () => void
}

function BackupRestore({ onRestoreComplete }: BackupRestoreProps) {
    const [isRestoring, setIsRestoring] = useState(false)
    const toast = useToast()

    const handleExportBackup = () => {
        try {
            const data = backupService.exportBackup()
            backupService.downloadBackupFile(data)
            toast({
                title: 'Sucesso',
                description: 'Backup baixado',
                status: 'success',
                duration: 2000,
                isClosable: true,
            })
        } catch (error) {
            toast({
                title: 'Erro',
                description: 'Falha ao exportar backup',
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
        }
    }

    const handleImportBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsRestoring(true)

        try {
            const data = await backupService.parseBackupFile(file)
            const confirm = window.confirm('Isso substituirá seus dados atuais. Continuar?')

            if (confirm) {
                backupService.restoreBackup(data)
                onRestoreComplete()
                toast({
                    title: 'Sucesso',
                    description: 'Dados restaurados',
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                })
            }
        } catch (error) {
            toast({
                title: 'Erro',
                description: error instanceof Error ? error.message : 'Falha ao restaurar backup',
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
        } finally {
            setIsRestoring(false)
            // Reset input
            if (e.target) {
                e.target.value = ''
            }
        }
    }

    return (
        <VStack spacing={8} maxW="500px" mx="auto">
            {/* Backup Section */}
            <Card w="100%">
                <CardHeader>
                    <Heading size="md">Fazer backup dos dados</Heading>
                </CardHeader>
                <Divider />
                <CardBody>
                    <VStack spacing={4} align="stretch">
                        <Text fontSize="sm" color="gray.600">
                            Baixe um backup de todas as suas listas de compras e histórico
                        </Text>
                        <Button leftIcon={<DownloadIcon />} borderRadius={100} colorScheme="blue" onClick={handleExportBackup} w="100%">
                            Baixar backup
                        </Button>
                    </VStack>
                </CardBody>
            </Card>

            {/* Restore Section */}
            <Card w="100%">
                <CardHeader>
                    <Heading size="md">Restaurar dados</Heading>
                </CardHeader>
                <Divider />
                <CardBody>
                    <VStack spacing={4} align="stretch">
                        <Text fontSize="sm" color="gray.600">
                            Restaure suas listas de compras de um arquivo de backup
                        </Text>
                        <Input
                            type="file"
                            accept=".json"
                            onChange={handleImportBackup}
                            disabled={isRestoring}
                            p={1}
                        />
                    </VStack>
                </CardBody>
            </Card>

            {/* Clear All */}
            <Card w="100%" borderColor="red.200" borderWidth="1px">
                <CardHeader>
                    <Heading size="md" color="red.600">
                        Atenção
                    </Heading>
                </CardHeader>
                <Divider />
                <CardBody>
                    <VStack spacing={4} align="stretch">
                        <Text fontSize="sm" color="gray.600">
                            Limpar todos os dados permanentemente (não pode ser desfeito)
                        </Text>
                        <Button
                            leftIcon={<DeleteIcon />}
                            borderRadius={100}
                            colorScheme="red"
                            variant="outline"
                            w="100%"
                            onClick={() => {
                                const confirm = window.confirm(
                                    'Isso apagará permanentemente todas as suas listas de compras. Isso não pode ser desfeito. Continuar?'
                                )
                                if (confirm) {
                                    const confirm2 = window.confirm(
                                        'Você tem certeza? Esta ação não pode ser revertida.'
                                    )
                                    if (confirm2) {
                                        import('../services/storageService').then(m => m.clearAllData())
                                        window.location.reload()
                                    }
                                }
                            }}
                        >
                            Apagar tudo
                        </Button>
                    </VStack>
                </CardBody>
            </Card>
        </VStack>
    )
}

export default BackupRestore
