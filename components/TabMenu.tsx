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
            setSelectedCourse(course);
            setActiveIndex(1);
        }
    };

    const handleSelectCase = (caseItem: string) => {
        if (caseItem === "Back") {
            setActiveIndex(0);
        } else {
            setSelectedCase(caseItem); // will drive data injection into Chat prompt
            setActiveIndex(2);
        }
    };

    const handleSelectInteraction = (interactionItem: string) => {
        if (interactionItem === "Back") {
            setActiveIndex(1);
        } else {
            setSelectedInteraction(interactionItem);
            setActiveIndex(3);
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
                    <ThirdTab
                    selectedCase={selectedCase}
                    onSelectInteraction={handleSelectInteraction} />
                )}

                {activeIndex === 3 && 
                    <Chat 
                    accessToken={accessToken}
                    selectedCase={selectedCase}
                />}
            </div>
        </div>
    )
}