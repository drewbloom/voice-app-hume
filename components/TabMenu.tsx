"use client";

import { TabMenu } from "primereact/tabmenu";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import FirstTab from "./Tab1";
import SecondTab from "./Tab2";
import ThirdTab from "./Tab3";
import CourseIcon from "./icons/Course";
import CaseIcon from "./icons/Case";
import InteractionIcon from "./icons/Interaction";
import StartIcon from "./icons/Start";

export default function Menu({accessToken,} : {accessToken: string;}) {
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
    const [selectedCase, setSelectedCase] = useState<string | null>(null);
    const [selectedInteraction, setSelectedInteraction] = useState<string | null>(null);
    const [updatedConfigVersion, setUpdatedConfigVersion] = useState<string>(""); // Hume API ref says this is a number, but Chat component args call for string
    const [loading, setLoading] = useState<boolean>(false); // load state for config updates to run between tab 3 and 4 (Chat initialization)
    let caseTitle = "";
    const Chat = dynamic(() => import("@/components/Chat"), {
        ssr: false,
      });
    const items = [
        {
            label: 'Course',
            icon: <CourseIcon/>
        },
        {
            label: 'Case',
            icon: <CaseIcon/>
        },
        {
            label: 'Interaction',
            icon: <InteractionIcon/>
        },
        {
            label: 'Start Practice',
            icon: <StartIcon/>
        },
    ];

    const handleSelectCourse = (course: string) => {
        if (course === 'Back') {
            setActiveIndex((prevIndex) => Math.max(prevIndex - 1, 0));
            setSelectedCourse(null);
        } else {
            setSelectedCourse(course); // tells tab2 which case list to feed
            setActiveIndex(1);
        }
    };

    const handleSelectCase = (caseTitle: string) => {
        if (caseTitle === "Back") {
            setActiveIndex(0);
        } else {
            setSelectedCase(caseTitle); // logic not written yet - will tell tab3 which interaction list to feed based on case title
            setActiveIndex(2);
        }
    };

    const handleSelectInteraction = (interactionType: string) => {
        if (interactionType === "Back") {
            setActiveIndex(1);
        } else {
            setSelectedInteraction(interactionType); // logic not written yet - recursion or second method like updateConfig adds interaction type to system prompt
            // updateConfigInteraction to inject the scenario for Initial History, Differential Diagnosis Review, or Skill Practice
            setLoading(true);
            fetchUpdatedConfig();
        }
    };

    const fetchUpdatedConfig = async() => {
        if (selectedCase) {
            try {
                const response = await fetch('/api/getUpdatedConfig', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json'},
                    body: JSON.stringify({caseTitle: selectedCase}),
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch updated config");
                }

                const data = await response.json();
                setUpdatedConfigVersion(String(data.updatedConfigVersion));
                setActiveIndex(3);
            } catch (error) {
                console.error("Error fetching updated configuration:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="card w-3/4 mx-auto">
            <TabMenu
                model={items.map((item, index) => ({
                    ...item,
                    className: index === activeIndex ? "active-tab" : "",
                }))}
                activeIndex={activeIndex}
            />
            <div className="relative grow flex flex-col mx-auto w-full overflow-hidden">
                {activeIndex === 0 && <FirstTab onSelectCourse={handleSelectCourse} />}

                {activeIndex === 1 && selectedCourse && (
                    <SecondTab 
                    selectedCourse={selectedCourse}
                    onSelectCase={handleSelectCase}/>
                )}

                {activeIndex === 2 && (
                    loading ? (
                        <div>Configuring your practice session now... get ready!</div>
                    ) : (
                    <ThirdTab
                    selectedCase={selectedCase}
                    onSelectInteraction={handleSelectInteraction} />
                    )
                )}

                {activeIndex === 3 && 
                    <Chat 
                    accessToken={accessToken}
                    updatedConfigVersion={updatedConfigVersion} // need to get API to fetch this server component
                    />
                }
            </div>
        </div>
    )
}