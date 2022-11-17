import React, { useEffect, useState } from "react";
//bootstrap
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
//redux
import { useSelector, useDispatch } from "react-redux";
import { getAvailableCourses, setUser } from "../redux/userActions";
import Selected from "./Selected";

export default function CourseList() {
  const dispatch = useDispatch();
  const { courses, user, errors, registration } = useSelector(
    (state) => state.user
  );
  const [availableCourses, setAvailableCourses] = useState(courses);
  const [defaultCourses, setDefaultCourses] = useState(courses);
  const [totalCredits, setTotalCredits] = useState(0);
  const [staged, setStaged] = useState([]);
  const [currentTab, setCurrentTab] = useState("all");
  //defaults
  let numToType = [
    "Not offered",
    "Institute Core",
    "Discipline Core",
    "Discipline Elective",
    "Free Elective",
  ];
  //funcs
  const handleSelect = (eventKey) => {
    switch (eventKey) {
      case "select":
        break;
      case "C":
        // 1 is institute core and 2 is discipline core
        setAvailableCourses(
          defaultCourses.filter((course) => {
            return [1, 2].includes(course[user.branch]);
          })
        );
        break;
      case "DE":
        // 3 is discipline elective
        setAvailableCourses(
          defaultCourses.filter((course) => {
            return [3].includes(course[user.branch]);
          })
        );
        break;
      case "FE":
        // 4 is free elective
        setAvailableCourses(
          defaultCourses.filter((course) => {
            return [4].includes(course[user.branch]);
          })
        );
        break;
      default:
        //aa
        setAvailableCourses(defaultCourses);
    }
  };
  const cancelChanges = (e) => {
    e.preventDefault();
    setStaged([]);
    dispatch(setUser({ user: { ...user } }));
  };
  const handleStage = (e, id) => {
    e.preventDefault();
    const course = availableCourses.filter((course) => course._id === id)[0];
    setStaged([...staged, course]);
    setDefaultCourses(
      defaultCourses.filter((course) => {
        return course._id !== id;
      })
    );
    setAvailableCourses(
      availableCourses.filter((course) => {
        return course._id !== id;
      })
    );
  };
  const removeStage = (e, id) => {
    e.preventDefault();
    const course = staged.filter((course) => course._id === id)[0];
    setDefaultCourses([...defaultCourses, course]);
    setStaged(
      staged.filter((course) => {
        return course._id !== id;
      })
    );
  };
  // initial
  useEffect(() => {
    let numToType = [
      "Not offered",
      "Institute Core",
      "Discipline Core",
      "Discipline Elective",
      "Free Elective",
    ];
    setStaged([]);
    setDefaultCourses(
      courses.map((course) => {
        return {
          _id: course._id,
          name: course.name,
          courseCode: course.courseCode,
          semester: course.semester,
          description: course.description,
          LTPC: course.LTPC,
          [user.branch]: course[user.branch],
          credits: course.credits,
          typeCourse: numToType[course[user.branch]],
        };
      })
    );
  }, [courses, user]);

  useEffect(() => {
    handleSelect(currentTab);
  }, [defaultCourses]);

  useEffect(() => {
    setTotalCredits(
      staged.reduce(
        (acc, curr) => {
          return acc + curr.credits;
        },
        user.courses
          .filter((value) => value.semester === user.semester)
          .reduce((acc2, curr2) => {
            return acc2 + curr2.credits;
          }, 0)
      )
    );
  }, [user, staged]);
  useEffect(() => {
    dispatch(getAvailableCourses(user._id));
  }, [user]);

  return (
    <div className="container">
      <Tabs
        activeKey={currentTab}
        onSelect={(e) => {
          setCurrentTab(e);
          handleSelect(e);
        }}
        variant="tabs"
        id="justify-tab-example"
        className="mb-3"
        justify
      >
        <Tab eventKey="select" title="Selected">
          <Selected
            custom={{
              coursesToShow: staged,
              staged: staged,
              changeFunction: removeStage,
              cancelChanges: cancelChanges,
              isAdd: false,
              user: user,
              errors: errors,
              totalCredits: totalCredits,
              setCurrentTab: setCurrentTab,
            }}
          />
        </Tab>
        <Tab eventKey="all" title="All Courses">
          <Selected
            custom={{
              coursesToShow: availableCourses,
              staged: staged,
              changeFunction: handleStage,
              cancelChanges: cancelChanges,
              isAdd: true,
              user: user,
              errors: errors,
              totalCredits: totalCredits,
              setCurrentTab: setCurrentTab,
            }}
          />
        </Tab>
        <Tab eventKey="C" title="Core">
          <Selected
            custom={{
              coursesToShow: availableCourses,
              staged: staged,
              changeFunction: handleStage,
              cancelChanges: cancelChanges,
              isAdd: true,
              user: user,
              errors: errors,
              totalCredits: totalCredits,
              setCurrentTab: setCurrentTab,
            }}
          />
        </Tab>
        <Tab eventKey="DE" title="Discipline Elective">
          <Selected
            custom={{
              coursesToShow: availableCourses,
              staged: staged,
              changeFunction: handleStage,
              cancelChanges: cancelChanges,
              isAdd: true,
              user: user,
              errors: errors,
              totalCredits: totalCredits,
              setCurrentTab: setCurrentTab,
            }}
          />
        </Tab>
        <Tab eventKey="FE" title="Free Elective">
          <Selected
            custom={{
              coursesToShow: availableCourses,
              staged: staged,
              changeFunction: handleStage,
              cancelChanges: cancelChanges,
              isAdd: true,
              user: user,
              errors: errors,
              totalCredits: totalCredits,
              setCurrentTab: setCurrentTab,
            }}
          />
        </Tab>
      </Tabs>
    </div>
  );
}
