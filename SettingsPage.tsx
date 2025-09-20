
import React, { useState, useEffect } from 'react';

type SettingsSectionProps = { title: string; children: React.ReactNode };
const SettingsSection = ({ title, children }: SettingsSectionProps) => (
    <div className="mt-10">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{title}</h2>
        <div className="border-t border-gray-200 dark:border-gray-700"></div>
        <div className="mt-6 space-y-6">{children}</div>
    </div>
);

const ToggleSwitch = ({ label, description, isEnabled, onToggle }: { label: string, description: string, isEnabled: boolean, onToggle: () => void }) => (
  <div className="flex items-center justify-between">
    <div>
      <p className="font-medium text-gray-800 dark:text-gray-200">{label}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
    </div>
    <button onClick={onToggle} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isEnabled ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isEnabled ? 'translate-x-6' : 'translate-x-1'}`}/>
    </button>
  </div>
);


const SettingsPage: React.FC = () => {
    const [profile, setProfile] = useState({
        name: 'Olivia Chen',
        email: 'olivia.chen@example.com',
        bio: 'Avid learner and tech enthusiast.',
        phone: '123-456-7890'
    });
    const [avatar, setAvatar] = useState('https://picsum.photos/id/237/200/200');
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'system');
    const [preferences, setPreferences] = useState({
        language: 'English',
        summaryLength: 'medium',
        noteStyle: 'bullets'
    });
    const [notifications, setNotifications] = React.useState(true);
    const [privacy, setPrivacy] = React.useState(true);
    const [marketing, setMarketing] = React.useState(false);
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAvatar(URL.createObjectURL(e.target.files[0]));
        }
    };
    
    const handlePreferencesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPreferences({ ...preferences, [e.target.name]: e.target.value });
    }

    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(''), 3000);
    };

    const handleSave = () => {
        // In a real app, this would be an API call
        console.log("Saving profile:", profile);
        console.log("Saving preferences:", preferences);
        showToast("Settings saved successfully!");
    }

    return (
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 fade-in">
            {/* User Profile Section */}
            <div className="bg-white dark:bg-gray-800/50 p-8 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-8">
                <div className="relative">
                    <img src={avatar} alt="User Avatar" className="w-28 h-28 rounded-full object-cover" />
                    <label htmlFor="avatar-upload" className="absolute -bottom-2 -right-2 w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-indigo-700 transition-colors">
                        <i className="fas fa-camera"></i>
                        <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                    </label>
                </div>
                <div className="flex-grow text-center sm:text-left">
                     <input type="text" name="name" value={profile.name} onChange={handleProfileChange} className="text-3xl font-bold text-gray-900 dark:text-white bg-transparent border-b-2 border-transparent focus:border-indigo-500 focus:outline-none w-full" />
                     <input type="email" name="email" value={profile.email} onChange={handleProfileChange} className="text-gray-600 dark:text-gray-400 bg-transparent border-b-2 border-transparent focus:border-indigo-500 focus:outline-none w-full mt-1" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16">
                <div>
                    {/* Account Settings */}
                    <SettingsSection title="Account Settings">
                        <SettingItem label="Bio">
                           <textarea name="bio" value={profile.bio} onChange={handleProfileChange} rows={2} className="w-full bg-gray-100 dark:bg-gray-700/50 p-2 rounded-lg border-transparent focus:ring-2 focus:ring-indigo-500 text-sm"/>
                        </SettingItem>
                         <SettingItem label="Phone Number">
                           <input type="tel" name="phone" value={profile.phone} onChange={handleProfileChange} className="w-full bg-gray-100 dark:bg-gray-700/50 p-2 rounded-lg border-transparent focus:ring-2 focus:ring-indigo-500 text-sm"/>
                        </SettingItem>
                        <SettingItem label="Membership Status">
                            <div className="flex items-center justify-between">
                               <p className="text-sm text-gray-500 dark:text-gray-400">Premium Plan</p>
                               <button className="px-4 py-2 text-sm font-medium main-gradient-bg-light text-white rounded-lg hover:opacity-90">Manage Plan</button>
                            </div>
                        </SettingItem>
                         <SettingItem label="Change Password">
                           <button className="px-4 py-2 text-sm font-medium bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">Change Password</button>
                        </SettingItem>
                    </SettingsSection>
                    
                     {/* Appearance Settings */}
                    <SettingsSection title="Appearance">
                         <SettingItem label="Theme">
                            <select name="theme" value={theme} onChange={(e) => setTheme(e.target.value)} className="w-full bg-gray-100 dark:bg-gray-700 border-transparent rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500">
                                <option value="light">Light</option>
                                <option value="dark">Dark</option>
                                <option value="system">System Default</option>
                            </select>
                        </SettingItem>
                        <SettingItem label="Language">
                            <select name="language" value={preferences.language} onChange={handlePreferencesChange} className="w-full bg-gray-100 dark:bg-gray-700 border-transparent rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500">
                                <option>English</option>
                                <option>Spanish</option>
                                <option>French</option>
                            </select>
                        </SettingItem>
                    </SettingsSection>
                </div>
                <div>
                     {/* Study Preferences */}
                    <SettingsSection title="Study Preferences">
                        <SettingItem label="Summary Length">
                            <select name="summaryLength" value={preferences.summaryLength} onChange={handlePreferencesChange} className="w-full bg-gray-100 dark:bg-gray-700 border-transparent rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500">
                                <option value="short">Short</option>
                                <option value="medium">Medium</option>
                                <option value="detailed">Detailed</option>
                            </select>
                        </SettingItem>
                        <SettingItem label="Note Style">
                            <select name="noteStyle" value={preferences.noteStyle} onChange={handlePreferencesChange} className="w-full bg-gray-100 dark:bg-gray-700 border-transparent rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500">
                                <option value="bullets">Bullet Points</option>
                                <option value="outline">Outline</option>
                                <option value="paragraph">Paragraph</option>
                            </select>
                        </SettingItem>
                    </SettingsSection>
                    
                     {/* General Preferences */}
                    <SettingsSection title="General Preferences">
                        <ToggleSwitch label="Notifications" description="Receive alerts for important updates." isEnabled={notifications} onToggle={() => setNotifications(!notifications)} />
                        <ToggleSwitch label="Data Privacy" description="Control how your data is used." isEnabled={privacy} onToggle={() => setPrivacy(!privacy)} />
                        <ToggleSwitch label="Marketing Emails" description="Opt-in to receive promotional emails." isEnabled={marketing} onToggle={() => setMarketing(!marketing)} />
                    </SettingsSection>
                </div>
            </div>
             <div className="mt-12 flex justify-end">
                <button onClick={handleSave} className="px-8 py-3 font-semibold text-white main-gradient-bg-light rounded-lg hover:opacity-90 transition-opacity shadow-md">
                    Save Changes
                </button>
            </div>
             {toastMessage && (
                <div className="fixed bottom-5 right-5 main-gradient-bg text-white px-4 py-2 rounded-lg shadow-lg toast-enter">
                    {toastMessage}
                </div>
            )}
        </div>
    );
};

const SettingItem = ({ label, children }: { label: string, children: React.ReactNode }) => (
    <div>
        <label className="block font-medium text-gray-800 dark:text-gray-200 mb-2">{label}</label>
        {children}
    </div>
);


export default SettingsPage;