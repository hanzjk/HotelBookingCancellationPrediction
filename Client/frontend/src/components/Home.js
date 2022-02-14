import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import "bootstrap/dist/js/bootstrap.bundle.js";

function Home() {
  const [months, setMonths] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [customerTypes, setCustomerTypes] = useState([]);
  const [marketSegments, setMarketSegments] = useState([]);
  const [depositTypes, setDepositTypes] = useState([]);
  const [distributionChannels, setDistributionChannels] = useState([]);

  const [month, setMonth] = useState(["July"]);
  const [roomType, setRoomType] = useState(["A"]);
  const [customerType, setCustomerType] = useState(["Transient"]);
  const [marketSegment, setMarketSegment] = useState(["Direct"]);
  const [depositType, setDepositType] = useState(["No Deposit"]);
  const [distributionChannel, setDistributionChannel] = useState(["Direct"]);
  const [guests, setGuests] = useState([2]);
  const [day, setDay] = useState([1]);
  const [stays, setStays] = useState([2]);
  const [bookingChanges, setBookingChanges] = useState([0]);
  const [carParkingSpaces, setCarParkingSpaces] = useState([1]);
  const [adr, setAdr] = useState([12]);
  const [previousCancellations, setPreviousCancellations] = useState([1]);
  const [totRequests, setTotRequests] = useState([2]);
  const [leadTime, setLeadTime] = useState([23]);

  const [predVal, setPredVal] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [target0, setTarget0] = useState(null);
  const [target1, setTarget1] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      axios
        .get("arrival_month")
        .then((res) => {
          setMonths(res.data.month);
          console.log(res.data.month);
        })
        .catch((err) => {
          alert(err);
        });

      axios
        .get("reserved_room_types")
        .then((res) => {
          setRoomTypes(res.data.roomType);
          console.log(res.data.roomType);
        })
        .catch((err) => {
          alert(err);
        });

      axios
        .get("customer_types")
        .then((res) => {
          setCustomerTypes(res.data.customerType);
          console.log(res.data.customerType);
        })
        .catch((err) => {
          alert(err);
        });

      axios
        .get("market_segments")
        .then((res) => {
          setMarketSegments(res.data.market_segments);
          console.log(res.data.market_segments);
        })
        .catch((err) => {
          alert(err);
        });

      axios
        .get("deposit_types")
        .then((res) => {
          setDepositTypes(res.data.deposit_types);
          console.log(res.data.deposit_types);
        })
        .catch((err) => {
          alert(err);
        });

      axios
        .get("distribution_channels")
        .then((res) => {
          setDistributionChannels(res.data.distribution_channels);
          console.log(res.data.distribution_channels);
        })
        .catch((err) => {
          alert(err);
        });
    };
    fetchData();
  }, []);

  function getPrediction(e) {
    e.preventDefault();
    var newBooking = {
      reserved_room_type: roomType,
      guests: guests,
      distribution_channel: distributionChannel,
      arrival_date_month: month,
      arrival_date_day_of_month: day,
      total_stays: stays,
      booking_changes: bookingChanges,
      required_car_parking_spaces: carParkingSpaces,
      customer_type: customerType,
      adr: adr,
      previous_cancellations: previousCancellations,
      market_segment: marketSegment,
      total_of_special_requests: totRequests,
      lead_time: leadTime,
      deposit_type: depositType,
    };

    axios
      .post("predict_cancellation", newBooking)
      .then((res) => {
        console.log(res.data.prediction);
        setPredVal(res.data.prediction);
        setTarget0(res.data.target0);
        setTarget1(res.data.target1);


        if (res.data.prediction === 0) {
          setPrediction("Confirmed");
        } else if (res.data.prediction === 1) {
          setPrediction("Cancelled");
        }
      })
      .catch((err) => {
        alert(err);
        if (err.response) console.log(err.response);

        if (err.request) console.log(err.request);
      });
  }

  return (
    <div>
      <Container className="mt-5">
        <Form onSubmit={getPrediction}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Room Type</Form.Label>
                <Form.Select
                  aria-label="Room Type select"
                  id="roomType"
                  onChange={(e) => {
                    setRoomType(e.target.value);
                  }}
                >
                  <option value="" selected disabled hidden>
                    --Select Room Type--
                  </option>

                  {roomTypes.map((roomtype, index) => (
                    <option key={index} value={roomtype}>
                      {roomtype}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Customer Type</Form.Label>
                <Form.Select
                  aria-label="Customer Type select"
                  id="custometType"
                  onChange={(e) => {
                    setCustomerType(e.target.value);
                  }}
                >
                  <option value="" selected disabled hidden>
                    --Select Customer Type--
                  </option>

                  {customerTypes.map((custtype, index) => (
                    <option key={index} value={custtype}>
                      {custtype}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Guests</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter the total number of guests"
                  id="guests"
                  onChange={(e) => {
                    setGuests(parseInt(e.target.value));
                  }}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Total Stays</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter the Total number of stays"
                  id="stays"
                  onChange={(e) => {
                    setStays(parseInt(e.target.value));
                  }}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Distribution Channel </Form.Label>
                <Form.Select
                  aria-label="Distribution Channel select"
                  id="distributionChannel"
                  onChange={(e) => {
                    setDistributionChannel(e.target.value);
                  }}
                >
                  <option value="" selected disabled hidden>
                    --Select Distribution Channel--
                  </option>

                  {distributionChannels.map((dc, index) => (
                    <option key={index} value={dc}>
                      {dc}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Market Segement Type</Form.Label>
                <Form.Select
                  aria-label="Market Segement select"
                  id="marketSegment"
                  onChange={(e) => {
                    setMarketSegment(e.target.value);
                  }}
                >
                  <option value="" selected disabled hidden>
                    --Select Market Segment--
                  </option>

                  {marketSegments.map((ms, index) => (
                    <option key={index} value={ms}>
                      {ms}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Booking Changes</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Booking Changes"
                  id="bookingChanges"
                  onChange={(e) => {
                    setBookingChanges(parseInt(e.target.value));
                  }}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Car Parking Spaces</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Car Parking Spaces"
                  id="carparking"
                  onChange={(e) => {
                    setCarParkingSpaces(parseInt(e.target.value));
                  }}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Total Special Requests</Form.Label>
                <Form.Control
                  type="number"
                  placeholder=" Special Requests"
                  id=" specialRequests"
                  onChange={(e) => {
                    setTotRequests(parseInt(e.target.value));
                  }}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Arrival Month</Form.Label>
                <Form.Select
                  aria-label="Arrival Month select"
                  id="month"
                  onChange={(e) => {
                    setMonth(e.target.value);
                  }}
                >
                  <option value="" selected disabled hidden>
                    --Select Month--
                  </option>
                  <option value="January">January</option>
                  <option value="February">February</option>
                  <option value="March">March</option>
                  <option value="April">April</option>
                  <option value="May">May</option>
                  <option value="June">June</option>
                  <option value="July">July</option>
                  <option value="August">August</option>
                  <option value="September">September</option>
                  <option value="October">October</option>
                  <option value="November">November</option>
                  <option value="December">December</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Arrival Day</Form.Label>
                <Form.Select
                  aria-label="Day select"
                  id="day"
                  onChange={(e) => {
                    setDay(e.target.value);
                  }}
                >
                  <option value="" selected disabled hidden>
                    --Select Day--
                  </option>

                  <option value="1">Monday</option>
                  <option value="2">Tuesday</option>
                  <option value="3">Wednesday</option>
                  <option value="4">Thursday</option>
                  <option value="5">Friday</option>
                  <option value="6">Saturday</option>
                  <option value="7">Sunday</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>ADR</Form.Label>
                <Form.Control
                  type="float"
                  placeholder="ADR"
                  id="adr"
                  onChange={(e) => {
                    setAdr(parseFloat(e.target.value));
                  }}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Previous Cancellations</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Previous Cancellations"
                  id="previousCancellations"
                  onChange={(e) => {
                    setPreviousCancellations(parseInt(e.target.value));
                  }}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Deposit Type</Form.Label>
                <Form.Select
                  aria-label="Deposit Type select"
                  id="depositType"
                  onChange={(e) => {
                    setDepositType(e.target.value);
                  }}
                >
                  <option value="" selected disabled hidden>
                    --Select Deposit Type--
                  </option>

                  {depositTypes.map((dt, index) => (
                    <option key={index} value={dt}>
                      {dt}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Lead Time</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Lead Time"
                  id="leadTime"
                  onChange={(e) => {
                    setLeadTime(parseInt(e.target.value));
                  }}
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="d-grid">
            <Button
              type="submit"
              size="lg"
              style={{ backgroundColor: "#008B8B" }}
            >
              View Prediction
            </Button>
          </div>
        </Form>

        <br></br>
        <Card className="text-center">
          <Card.Header>
            <strong>Cancellation Prediction</strong>
          </Card.Header>
          <Card.Body>
            <Card.Title>
              The Chances of Cancellation is <strong></strong>
              {parseFloat(target1).toFixed(2).toString()}
            </Card.Title>
            <Card.Title>
              The Chances of Confirmed is <strong></strong>
              {parseFloat(target0).toFixed(2).toString()}
            </Card.Title>

            <Card.Title>
              Booking will be more likely to be 
              <strong>&nbsp;{prediction}</strong>
            </Card.Title>
          </Card.Body>
          <Card.Footer className="text-muted">
            Last updated on Feb 2022
          </Card.Footer>
        </Card>
        <br></br>
      </Container>
    </div>
  );
}

export default Home;
