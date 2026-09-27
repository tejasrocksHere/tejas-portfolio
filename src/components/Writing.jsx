import { useRef } from 'react'
import { useFadeIn } from '../hooks/useFadeIn.js'

export default function Writing() {
    const ref = useRef(null)
    useFadeIn(ref)

    return (
        <section id="series">
            <div className="wrap">
                <div className="sec-head">
                    <h2>Engineering & Insights</h2>
                    <span className="idx">Concepts over syntax</span>
                </div>

                <div className="insights-container fade" ref={ref} style={{ opacity: 0 }}>
                    {/* Left: Summary and Highlights */}
                    <div className="insights-details">
                        <div className="insight-card">
                            <span className="badge">Featured Series</span>
                            <h3>Syntax-Free Backend Engineering</h3>
                            <p>
                                We put way too much importance on language labels. My LinkedIn educational series strips away language syntax to break down backend engineering through <b>core architectural principles</b>—distributed consensus, database indexing, race conditions, caching strategies, and concurrency patterns.
                            </p>
                            <a
                                href="https://www.linkedin.com/in/tejas-mundhe"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="series-link"
                            >
                                Follow the series on LinkedIn →
                            </a>
                        </div>

                        <div className="insight-grid-2">
                            <div className="insight-subcard">
                                <div className="subcard-stat">1,500+</div>
                                <div className="subcard-title">DSA Problems Solved</div>
                                <p>
                                    Mastered algorithmic patterns across platforms (LeetCode, GFG, Codeforces). Deep intuition for Graph Theory, Dynamic Programming, and Concurrency synchronization.
                                </p>
                            </div>

                            <div className="insight-subcard">
                                <div className="subcard-stat">HLD / LLD</div>
                                <div className="subcard-title">System Architecture</div>
                                <p>
                                    Practical mastery of High-Level & Low-Level Design: Microservices decomposition, distributed STOMP record-locking, event-driven pipelines, and schema partitioning.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Live LinkedIn Post Embed */}
                    <div className="insights-embed-box">
                        <div className="embed-wrapper">
                            <iframe
                                src="https://www.linkedin.com/embed/feed/update/urn:li:share:7508180392978305024?collapsed=1"
                                height="673"
                                width="100%"
                                style={{ border: 'none', width: '100%', minHeight: '580px' }}
                                allowFullScreen=""
                                title="Tejas Mundhe LinkedIn Post - Syntax-Free Backend"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}