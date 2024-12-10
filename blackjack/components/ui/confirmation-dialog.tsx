import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmationDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationDialog({
  open,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Yaş Doğrulama</AlertDialogTitle>
          <AlertDialogDescription>
            <div className="space-y-3">
              <div className="text-base">
                Bu oyunu oynamak için 18 yaşından büyük olmanız gerekmektedir.
              </div>
              <div className="font-semibold">
                18 yaşından büyük olduğunuzu onaylıyor musunuz?
              </div>
              <div className="text-sm text-muted-foreground">
                Kumar bağımlılık yapabilir. Lütfen sorumlu oynayın.
                <br />
                Sonra ben sorumlu olmam ona göre bak. @Tolga BAYRAK
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Hayır</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Evet, 18 yaşından büyüğüm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 