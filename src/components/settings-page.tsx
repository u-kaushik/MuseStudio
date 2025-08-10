
'use client';

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const palettes = [
    { name: 'Earthy Tones', colors: '#8B4513, #A0522D, #D2B48C, #F5DEB3' },
    { name: 'Ocean Blues', colors: '#00008B, #0000CD, #4169E1, #87CEEB' },
    { name: 'Monochrome', colors: '#000000, #36454F, #808080, #D3D3D3' },
];

export function SettingsPage() {
    const { user } = useAuth();

    if (!user) {
        return null;
    }

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Profile</CardTitle>
                    <CardDescription>Update your profile information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={user.photoURL || "https://placehold.co/100x100.png"} data-ai-hint="woman portrait" />
                            <AvatarFallback>{user.displayName?.charAt(0) || 'M'}</AvatarFallback>
                        </Avatar>
                        <Button variant="outline">Change Photo</Button>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" defaultValue={user.displayName || ''} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue={user.email || ''} disabled />
                    </div>
                    <Button>Save Changes</Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Subscription</CardTitle>
                    <CardDescription>Manage your subscription plan.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p>You are currently on the <span className="font-semibold text-primary">Pro Plan</span>.</p>
                    <p className="text-sm text-muted-foreground">Your plan renews on January 1, 2025.</p>
                    <div className="flex space-x-2">
                        <Button>Change Plan</Button>
                        <Button variant="outline">Cancel Subscription</Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="font-headline">Brand Palettes</CardTitle>
                        <CardDescription>Save and manage your brand color palettes.</CardDescription>
                    </div>
                    <Button>Add New Palette</Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Palette Name</TableHead>
                                <TableHead>Colors</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {palettes.map((palette) => (
                                <TableRow key={palette.name}>
                                    <TableCell className="font-medium">{palette.name}</TableCell>
                                    <TableCell className="flex items-center gap-2">
                                        {palette.colors.split(', ').map(color => (
                                            <div key={color} className="h-6 w-6 rounded-full border" style={{ backgroundColor: color }} />
                                        ))}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon">
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">Delete</span>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
