
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MindframeStore from '../../core_logic/MindframeStore';
import GamificationService from '../../core_logic/gamificationService';
import { hcLibrary } from '../../assets/data/hc_library_data';
import { starterQuests } from '../../assets/data/starter_quests_data';
import type { MindframeStoreState, CompletedChallenge } from '../../core_logic/types';

const ProfileView: React.FC = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<MindframeStoreState | null>(null);
  
  useEffect(() => {
    const loadProfile = async () => {
      const storeState = await MindframeStore.get();
      if (!storeState.profile) {
        navigate('/onboarding');
        return;
      }
      setState(storeState);
    };
    loadProfile();
  }, [navigate]);

  if (!state || !state.profile) return null;

  const level = GamificationService.getLevel(state.wxp);
  const activeQuests = starterQuests.filter(quest => 
    state.activeQuestIds.includes(quest.id)
  );

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Your MINDFRAME Profile</h1>
        <div className="flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-lg">
            <span className="text-xl">Level {level}</span>
          </div>
          <div>
            <div className="text-sm text-gray-600">WXP</div>
            <div className="font-medium">{state.wxp} points</div>
          </div>
        </div>
      </div>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Active Quests</h2>
        <div className="space-y-4">
          {activeQuests.map(quest => (
            <div key={quest.id} className="border p-4 rounded-lg">
              <h3 className="font-medium">{quest.title}</h3>
              <p className="text-sm text-gray-600">{quest.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Challenges</h2>
        <div className="space-y-4">
          {state.completedChallengeLog.slice(0, 5).map((challenge: CompletedChallenge, index) => (
            <div key={index} className="border p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{challenge.challengeText}</p>
                  <p className="text-sm text-gray-600">{challenge.hcRelated}</p>
                </div>
                <div className="text-sm text-gray-600">
                  {formatTimestamp(challenge.timestamp)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProfileView;
