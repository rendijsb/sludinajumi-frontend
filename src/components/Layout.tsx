// src/components/Layout.tsx
import React from 'react';
import { Navigation } from './Navigation';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation />
            <main>{children}</main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Sludinājumi.lv</h3>
                            <p className="text-gray-300 text-sm">
                                Latvijas lielākais sludinājumu portāls. Pārdod, pirkt, īrē - viss vienuviet.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Kategorijas</h4>
                            <ul className="space-y-2 text-sm text-gray-300">
                                <li><a href="/category/transport" className="hover:text-white">Transportlīdzekļi</a></li>
                                <li><a href="/category/real-estate" className="hover:text-white">Nekustamais īpašums</a></li>
                                <li><a href="/category/jobs" className="hover:text-white">Darbs</a></li>
                                <li><a href="/category/electronics" className="hover:text-white">Elektronika</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Palīdzība</h4>
                            <ul className="space-y-2 text-sm text-gray-300">
                                <li><a href="/help" className="hover:text-white">Biežāk uzdotie jautājumi</a></li>
                                <li><a href="/contact" className="hover:text-white">Kontakti</a></li>
                                <li><a href="/safety" className="hover:text-white">Drošība</a></li>
                                <li><a href="/rules" className="hover:text-white">Noteikumi</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Sekojiet mums</h4>
                            <ul className="space-y-2 text-sm text-gray-300">
                                <li><a href="#" className="hover:text-white">Facebook</a></li>
                                <li><a href="#" className="hover:text-white">Instagram</a></li>
                                <li><a href="#" className="hover:text-white">Twitter</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
                        <p>&copy; 2025 Sludinājumi.lv. Visas tiesības aizsargātas.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};