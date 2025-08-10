
'use client';

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const palettes = [
    { name: 'Earthy Tones', colors: '#8B4513, #A0522D, #D2B48C, #F5DEB3' },
    { name: 'Ocean Blues', colors: '#00008B, #0000CD, #4169E1, #87CEEB' },
    { name: 'Monochrome', colors: '#000000, #36454F, #808080, #D3D3D3' },
];

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512" fill="currentColor">
        <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 21.2 173.4 54.7l-73.2 67.7C321.6 98.6 289.1 86.4 248 86.4c-82.3 0-150.2 65.7-150.2 148.4s67.9 148.4 150.2 148.4c84.1 0 132-57.5 135-103.1H248v-85.3h236.1c2.3 12.7 3.9 26.9 3.9 41.4z" />
      </svg>
    );
}

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
                <CardContent className="space-y-6">
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

                    <Separator />

                     <div>
                        <Label className="text-lg font-headline">Connected Accounts</Label>
                         <div className="flex items-center justify-between rounded-lg border p-4 mt-2">
                            <div className="flex items-center gap-4">
                                <GoogleIcon className="h-6 w-6" />
                                <div>
                                    <p className="font-medium">Google</p>
                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                </div>
                            </div>
                            <Button variant="destructive" size="sm">Disconnect</Button>
                        </div>
                    </div>

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
