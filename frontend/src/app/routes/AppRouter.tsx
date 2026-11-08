import { Navigate, Route, Routes } from 'react-router-dom'
import type { ReactElement } from "react";
import NotFound from '@/pages/NotFound'
import AuthLayout from '@/features/auth/layouts/AuthLayout';
import LoginPage from '@/features/auth/pages/LoginPage';
import SignUpPage from '@/features/auth/pages/RegisterPage';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from '@/features/notes/layouts/DashboardLayout';
import DashboardPage from '@/features/notes/pages/DashboardPage';
import NoteEditorPage from '@/features/notes/pages/NoteEditorPage';
import PublicRoute from './PublicRoute';

export default function AppRouter(): ReactElement {
    return (
        <Routes>
            <Route element={<PublicRoute />}>
                <Route index element={<Navigate to="/login" replace />} />

                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<SignUpPage />} />
                </Route>
            </Route>


            <Route element={<ProtectedRoute />} >
                <Route element={<DashboardLayout />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/notes/new" element={<NoteEditorPage />} />
                    <Route path="/notes/:id/edit" element={<NoteEditorPage />} />
                </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}