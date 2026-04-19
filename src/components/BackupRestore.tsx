import { useState } from 'react'
import * as storageService from '../services/storageService'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import DownloadIcon from '@mui/icons-material/Download'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import * as backupService from '../services/backupService'
import ConfirmDialog from './ConfirmDialog'

interface BackupRestoreProps {
    onRestoreComplete: () => void
    showSnackbar: (message: string, severity?: 'success' | 'error' | 'info' | 'warning') => void
}

interface PendingConfirm {
    step: 'restore' | 'clear1' | 'clear2'
    file?: File
}

function BackupRestore({ onRestoreComplete, showSnackbar }: BackupRestoreProps) {
    const [isRestoring, setIsRestoring] = useState(false)
    const [pendingConfirm, setPendingConfirm] = useState<PendingConfirm | null>(null)

    const handleExportBackup = () => {
        try {
            const data = backupService.exportBackup()
            backupService.downloadBackupFile(data)
            showSnackbar('Backup baixado')
        } catch {
            showSnackbar('Falha ao exportar backup', 'error')
        }
    }

    const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        e.target.value = ''
        setPendingConfirm({ step: 'restore', file })
    }

    const handleRestoreConfirm = async () => {
        if (!pendingConfirm?.file) return
        const file = pendingConfirm.file
        setPendingConfirm(null)
        setIsRestoring(true)
        try {
            const data = await backupService.parseBackupFile(file)
            backupService.restoreBackup(data)
            onRestoreComplete()
            showSnackbar('Dados restaurados')
        } catch (error) {
            showSnackbar(error instanceof Error ? error.message : 'Falha ao restaurar backup', 'error')
        } finally {
            setIsRestoring(false)
        }
    }

    const handleClearAll = () => {
        setPendingConfirm({ step: 'clear1' })
    }

    const handleClear1Confirm = () => {
        setPendingConfirm({ step: 'clear2' })
    }

    const handleClear2Confirm = () => {
        setPendingConfirm(null)
        storageService.clearAllData()
        window.location.reload()
    }

    return (
        <Container maxWidth="sm" sx={{ pt: 2, pb: 2 }}>
            <Stack spacing={3}>
                {/* Backup */}
                <Card variant="outlined">
                    <CardHeader title="Fazer backup dos dados" titleTypographyProps={{ variant: 'subtitle1', fontWeight: 600 }} />
                    <Divider />
                    <CardContent>
                        <Stack spacing={2}>
                            <Typography variant="body2" color="text.secondary">
                                Baixe um backup de todas as suas listas de compras e histórico
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<DownloadIcon />}
                                onClick={handleExportBackup}
                                sx={{ borderRadius: 8 }}
                                fullWidth
                            >
                                Baixar backup
                            </Button>
                        </Stack>
                    </CardContent>
                </Card>

                {/* Restore */}
                <Card variant="outlined">
                    <CardHeader title="Restaurar dados" titleTypographyProps={{ variant: 'subtitle1', fontWeight: 600 }} />
                    <Divider />
                    <CardContent>
                        <Stack spacing={2}>
                            <Typography variant="body2" color="text.secondary">
                                Restaure suas listas de compras de um arquivo de backup
                            </Typography>
                            <Button
                                variant="outlined"
                                component="label"
                                disabled={isRestoring}
                                sx={{ borderRadius: 8 }}
                                fullWidth
                            >
                                {isRestoring ? 'Restaurando...' : 'Selecionar arquivo'}
                                <input type="file" accept=".json" hidden onChange={handleFileSelected} />
                            </Button>
                        </Stack>
                    </CardContent>
                </Card>

                {/* Clear All */}
                <Card variant="outlined" sx={{ borderColor: 'error.light' }}>
                    <CardHeader
                        title="Atenção"
                        titleTypographyProps={{ variant: 'subtitle1', fontWeight: 600, color: 'error.main' }}
                    />
                    <Divider />
                    <CardContent>
                        <Stack spacing={2}>
                            <Typography variant="body2" color="text.secondary">
                                Limpar todos os dados permanentemente (não pode ser desfeito)
                            </Typography>
                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<DeleteForeverIcon />}
                                onClick={handleClearAll}
                                sx={{ borderRadius: 8 }}
                                fullWidth
                            >
                                Apagar tudo
                            </Button>
                        </Stack>
                    </CardContent>
                </Card>
            </Stack>

            {/* Restore confirm */}
            <ConfirmDialog
                open={pendingConfirm?.step === 'restore'}
                title="Restaurar backup"
                message="Isso substituirá seus dados atuais. Continuar?"
                confirmLabel="Restaurar"
                onConfirm={handleRestoreConfirm}
                onCancel={() => setPendingConfirm(null)}
            />

            {/* Clear step 1 */}
            <ConfirmDialog
                open={pendingConfirm?.step === 'clear1'}
                title="Apagar todos os dados"
                message="Isso apagará permanentemente todas as suas listas de compras. Isso não pode ser desfeito. Continuar?"
                confirmLabel="Sim, apagar"
                severity="error"
                onConfirm={handleClear1Confirm}
                onCancel={() => setPendingConfirm(null)}
            />

            {/* Clear step 2 — double confirm */}
            <ConfirmDialog
                open={pendingConfirm?.step === 'clear2'}
                title="Tem certeza?"
                message="Esta ação é irreversível. Todos os seus dados serão perdidos permanentemente."
                confirmLabel="Apagar definitivamente"
                severity="error"
                onConfirm={handleClear2Confirm}
                onCancel={() => setPendingConfirm(null)}
            />

            {/* Padding for bottom nav */}
            <Box sx={{ height: 16 }} />
        </Container>
    )
}

export default BackupRestore
