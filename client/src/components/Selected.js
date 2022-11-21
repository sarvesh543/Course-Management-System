import React, { useEffect } from "react";
//bootstrap
import Card from "react-bootstrap/Card";
import { BsPlusCircle } from "react-icons/bs";
import { SlClose } from "react-icons/sl";
import Button from "react-bootstrap/esm/Button";
//redux
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, addCourses } from "../redux/userActions";
import Loading from "./Loading";

export default function Selected({ custom }) {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);
  const {
    coursesToShow,
    staged,
    changeFunction,
    isAdd,
    cancelChanges,
    errors,
    totalCredits,
    setCurrentTab,
  } = custom;
  useEffect(() => {
    dispatch(clearErrors());
  }, [dispatch]);

  return (
    <>
      <div className="container flex" style={{ minHeight: "100px" }}>
        {coursesToShow?.length === 0 && (
          <Card className="shadow ">
            <Card.Body>
              <h3 className="py-2">
                {isAdd
                  ? "No courses in this category"
                  : "Select courses to apply"}
              </h3>
              {isAdd && (
                <Button
                  className="my-auto mx-1"
                  style={{
                    float: "right",
                    display: "inline-block",
                  }}
                  onClick={(e) => setCurrentTab("select")}
                >
                  {loading ? <Loading /> : "View Selected Courses"}
                </Button>
              )}
            </Card.Body>
          </Card>
        )}
        {coursesToShow?.length > 0 && (
          <>
            <Card className="shadow">
              <Card.Body>
                {coursesToShow?.map((course, index) => (
                  <Card key={index} className="my-2">
                    <Card.Header className="clearfix">
                      <span>
                        {course.courseCode}: {course.name}
                      </span>
                      <span style={{ float: "right" }}>
                        {course.credits} Credits
                      </span>
                    </Card.Header>
                    <Card.Body>
                      <div style={{ display: "inline-block" }}>
                        <Card.Text className="mb-0">
                          LTPC: {course.LTPC}
                        </Card.Text>
                        <Card.Text className="my-0">
                          Type: {course.typeCourse}
                        </Card.Text>
                        <Card.Text className="my-0">
                          Semester: {course.semester}
                        </Card.Text>
                        {course.description && (
                          <Card.Text
                            as="a"
                            href={course.description}
                            target="_blank"
                          >
                            Learn More
                          </Card.Text>
                        )}
                      </div>
                      <Button
                        variant={isAdd ? "danger" : "primary"}
                        className="my-auto"
                        style={{
                          float: "right",
                          display: "inline-block",
                        }}
                        onClick={(e) => changeFunction(e, course._id)}
                      >
                        {isAdd ? <BsPlusCircle /> : <SlClose />}
                      </Button>
                    </Card.Body>
                  </Card>
                ))}
                <Card.Text
                  className="my-auto"
                  style={{
                    float: "left",
                    display: "inline-block",
                  }}
                >
                  Total Credits: {totalCredits}
                </Card.Text>
                {isAdd && (
                  <Button
                    className="my-auto mx-1"
                    style={{
                      float: "right",
                      display: "inline-block",
                    }}
                    onClick={(e) => setCurrentTab("select")}
                  >
                    {loading ? <Loading /> : "View Selected Courses"}
                  </Button>
                )}
                {!isAdd && (
                  <Button
                    className="my-auto mx-1"
                    style={{
                      float: "right",
                      display: "inline-block",
                    }}
                    onClick={(e) => cancelChanges(e)}
                    disabled={staged.length === 0 || loading}
                  >
                    {loading ? <Loading /> : "Remove All"}
                  </Button>
                )}
                {!isAdd && (
                  <Button
                    variant="danger"
                    className="my-auto mx-1"
                    style={{
                      float: "right",
                      display: "inline-block",
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      dispatch(addCourses(staged));
                    }}
                    disabled={staged.length === 0 || loading}
                  >
                    {loading ? <Loading /> : "Apply"}
                  </Button>
                )}
                <br />
                <Card.Text
                  style={{
                    float: "left",
                    display: "inline-block",
                  }}
                  className="text-danger pb-1 text-center"
                >
                  {errors.selected ? errors.selected : ""}
                </Card.Text>
              </Card.Body>
            </Card>
          </>
        )}
      </div>
    </>
  );
}
