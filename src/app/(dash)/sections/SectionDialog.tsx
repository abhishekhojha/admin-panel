import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface SectionDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess: () => void;
  createSectionApi: (data: any) => Promise<any>;
}

export default function SectionDialog({
  open,
  setOpen,
  onSuccess,
  createSectionApi,
}: SectionDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    displayOrder: 0,
    isActive: true,
  });

  useEffect(() => {
    if (open) {
      setFormData({
        title: "",
        slug: "",
        displayOrder: 0,
        isActive: true,
      });
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createSectionApi(formData);
      onSuccess();
      setOpen(false);
    } catch (error) {
      console.error("Failed to create section:", error);
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Section</DialogTitle>
          <DialogDescription>
            Add a new section. You can add products later by editing the
            section.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="slug" className="text-right">
                Slug
              </Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="displayOrder" className="text-right">
                Order
              </Label>
              <Input
                id="displayOrder"
                type="number"
                value={formData.displayOrder}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    displayOrder: parseInt(e.target.value),
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isActive" className="text-right">
                Active
              </Label>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: checked })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Section
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
