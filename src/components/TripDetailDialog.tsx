import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import MuiList from '@mui/material/List'
import MuiListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import CheckIcon from '@mui/icons-material/Check'
import { CompletedList } from '../types/index'
import { formatListDate, formatDuration } from '../services/analyticsService'

interface TripDetailDialogProps {
    trip: CompletedList | null
    onClose: () => void
}

function TripDetailDialog({ trip, onClose }: TripDetailDialogProps) {
    return (
        <Dialog open={!!trip} onClose={onClose} maxWidth="xs" fullWidth>
            {trip && (
                <>
                    <DialogTitle>
                        {formatListDate(trip.createdAt)}
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            Duração: {formatDuration(trip.durationMs)}
                        </Typography>
                    </DialogTitle>
                    <DialogContent>
                        {trip.purchasedItems && trip.purchasedItems.length > 0 ? (
                            <MuiList dense disablePadding>
                                {trip.purchasedItems.map((title, i) => (
                                    <MuiListItem key={i} disableGutters>
                                        <ListItemIcon sx={{ minWidth: 36 }}>
                                            <CheckIcon color="success" fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText primary={title} />
                                    </MuiListItem>
                                ))}
                            </MuiList>
                        ) : (
                            <Typography color="text.secondary" variant="body2">
                                Detalhes não disponíveis para esta viagem.
                            </Typography>
                        )}
                    </DialogContent>
                </>
            )}
            <DialogActions>
                <Button onClick={onClose}>Fechar</Button>
            </DialogActions>
        </Dialog>
    )
}

export default TripDetailDialog
