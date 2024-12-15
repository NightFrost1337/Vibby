import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import BottomNav from "@/components/nav/BottomNav";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Grid, Heart, Lock, Play, User, UserPlus, Settings, Share2, MessageCircle, X } from 'lucide-react';
import { useAuth } from "@/lib/hooks/useAuth";

const VideoGrid = ({ videos }) => (
  <div className="grid grid-cols-2 gap-4 p-4">
    {videos.map((video, index) => (
      <div key={index} className="relative rounded-lg overflow-hidden shadow-md">
        <img src={video.thumbnail} alt="" className="w-full h-40 object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <Play className="w-12 h-12 text-white" />
        </div>
        <div className="p-2 bg-white">
          <h3 className="font-semibold text-sm truncate">{video.title}</h3>
          <div className="flex items-center text-xs text-gray-500 mt-1">
            <Play className="w-3 h-3 mr-1" />
            <span>{video.views} views</span>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const FollowOverlay = ({ title, users, onClose }) => (
  <>
    <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
      className="fixed inset-x-0 bottom-0 bg-white dark:bg-gray-900 rounded-t-xl z-50 flex flex-col max-h-[80vh]"
    >
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 p-4 border-b flex items-center justify-between">
        <h2 className="font-semibold text-lg">{title}</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {users.map((user, i) => (
          <div key={i} className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user.username}</p>
            </div>
            <Button variant="outline" size="sm">
              {user.isFollowing ? 'Unfollow' : 'Follow'}
            </Button>
          </div>
        ))}
      </div>
    </motion.div>
  </>
);

export default function Profile() {
  const { user } = useAuth(); 
  const [activeTab, setActiveTab] = useState("videos");
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  const videos = Array(6).fill().map((_, i) => ({
    id: i,
    thumbnail: `/placeholder.svg?text=Video${i + 1}`,
    title: `Video ${i + 1}`,
    views: `${Math.floor(Math.random() * 100)}K`
  }));

  const mockUsers = Array(20).fill().map((_, i) => ({
    name: `User ${i + 1}`,
    username: `@user${i + 1}`,
    avatar: `/placeholder.svg?text=U${i + 1}`,
    isFollowing: Math.random() > 0.5
  }));

  if (!user) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100">
      <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="relative h-40 bg-gradient-to-r from-purple-400 to-pink-500">
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
            <Avatar className="w-32 h-32 border-4 border-white">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name || "User"} />
              <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
          </div>
        </div>
        
        <div className="mt-20 text-center">
          <h1 className="text-2xl font-bold">{user.name || "Anonymous User"}</h1>
          <p className="text-gray-600 mt-1">{user.username}</p>
          <p className="mt-2 px-4">{user.bio || "No bio available"}</p>
        </div>

        <div className="flex justify-center space-x-4 mt-4">
          <Button variant="outline" size="sm">
            <UserPlus className="w-4 h-4 mr-2" />
            Follow
          </Button>
          <Button variant="outline" size="sm">
            <MessageCircle className="w-4 h-4 mr-2" />
            Message
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex justify-center space-x-8 py-6 border-y border-gray-200 mt-6">
          <button onClick={() => setShowFollowing(true)} className="text-center">
            <p className="font-semibold text-xl">{user.following?.toLocaleString() || 0}</p>
            <p className="text-gray-600 text-sm">Following</p>
          </button>
          <button onClick={() => setShowFollowers(true)} className="text-center">
            <p className="font-semibold text-xl">{user.followers?.toLocaleString() || 0}</p>
            <p className="text-gray-600 text-sm">Followers</p>
          </button>
          <div className="text-center">
            <p className="font-semibold text-xl">{user.likes?.toLocaleString() || 0}</p>
            <p className="text-gray-600 text-sm">Likes</p>
          </div>
        </div>

        <Tabs defaultValue="videos" className="w-full mt-6">
          <TabsList className="w-full flex justify-around border-b">
            <TabsTrigger value="videos" className="flex-1 py-2">
              <Grid className="w-5 h-5 mr-2" />
              Videos
            </TabsTrigger>
            <TabsTrigger value="liked" className="flex-1 py-2">
              <Heart className="w-5 h-5 mr-2" />
              Liked
            </TabsTrigger>
          </TabsList>
          <TabsContent value="videos">
            <VideoGrid videos={videos} />
          </TabsContent>
          <TabsContent value="liked">
            <div className="h-48 flex items-center justify-center text-gray-500">
              Liked videos will appear here
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <BottomNav />

      <AnimatePresence>
        {showFollowers && (
          <FollowOverlay
            title="Followers"
            users={mockUsers}
            onClose={() => setShowFollowers(false)}
          />
        )}
        {showFollowing && (
          <FollowOverlay
            title="Following"
            users={mockUsers}
            onClose={() => setShowFollowing(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
